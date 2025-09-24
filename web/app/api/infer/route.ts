import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as pdf from 'pdf-parse'

// Initialize OpenAI (only if API key is valid)
let openai: OpenAI | null = null
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder-key-for-testing') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { fileContent } = await request.json()

    if (!fileContent) {
      return NextResponse.json({ success: false, error: 'No file content provided' }, { status: 400 })
    }

    if (!openai) {
      console.error('OpenAI API key not configured or invalid')
      return NextResponse.json({ 
        success: false, 
        error: 'OpenAI API key not configured. Please set a valid OPENAI_API_KEY environment variable.' 
      }, { status: 500 })
    }

    // Parse PDF content using LlamaIndex if available, fallback to pdf-parse
    let pdfText: string = ''
    try {
      const LLAMAINDEX_API_KEY = process.env.LLAMAINDEX_API_KEY
      
      if (LLAMAINDEX_API_KEY) {
        // Use LlamaIndex for better text extraction with layout preservation
        // Use LlamaParse API for better text extraction (EU region)
        // Step 1: Upload document
        // Convert base64 to buffer for multipart/form-data
        const base64Data = fileContent.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        const blob = new Blob([buffer], { type: 'application/pdf' })
        
        const formData = new FormData()
        formData.append('file', blob, 'document.pdf')
        
        const uploadResponse = await fetch('https://api.cloud.eu.llamaindex.ai/api/v1/parsing/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
          },
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          const jobId = uploadResult.id
          console.log('LlamaParse upload successful, job ID:', jobId)
          
          // Step 2: Poll for job completion
          let jobComplete = false
          let attempts = 0
          const maxAttempts = 30 // 30 seconds timeout
          
          while (!jobComplete && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
            
            const statusResponse = await fetch(`https://api.cloud.eu.llamaindex.ai/api/v1/parsing/job/${jobId}`, {
              headers: {
                'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
              }
            })
            
            if (statusResponse.ok) {
              const statusResult = await statusResponse.json()
              console.log('Job status:', statusResult.status)
              
              if (statusResult.status === 'SUCCESS') {
                // Step 3: Get the parsed result
                const resultResponse = await fetch(`https://api.cloud.eu.llamaindex.ai/api/v1/parsing/job/${jobId}/result/raw/markdown`, {
                  headers: {
                    'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
                  }
                })
                
                if (resultResponse.ok) {
                  pdfText = await resultResponse.text()
                  console.log('LlamaParse extraction successful')
                  jobComplete = true
                } else {
                  console.error('Failed to get LlamaParse result')
                  break
                }
              } else if (statusResult.status === 'ERROR') {
                console.error('LlamaParse job failed:', statusResult.error)
                break
              }
            } else {
              console.error('Failed to check LlamaParse job status')
              break
            }
            
            attempts++
          }
          
          if (!jobComplete) {
            console.log('LlamaParse timed out, falling back to pdf-parse')
            const pdfData = await pdf(Buffer.from(fileContent.split(',')[1], 'base64'))
            pdfText = pdfData.text
          }
        } else {
          console.error('LlamaParse upload failed:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            body: await uploadResponse.text()
          })
          // Fallback to pdf-parse if LlamaParse fails
          const pdfData = await pdf(Buffer.from(fileContent.split(',')[1], 'base64'))
          pdfText = pdfData.text
        }
      } else {
        // Fallback to pdf-parse if no LlamaIndex API key
        const pdfBuffer = Buffer.from(fileContent.split(',')[1], 'base64')
        const pdfData = await pdf(pdfBuffer)
        pdfText = pdfData.text
      }
    } catch (error) {
      console.error('PDF parsing error:', error)
      return NextResponse.json({ success: false, error: 'Failed to parse PDF' }, { status: 400 })
    }

    // Create schema inference prompt
    const inferencePrompt = `
Analyze this document and suggest a structured schema for data extraction.

Document text:
${pdfText.substring(0, 3000)}${pdfText.length > 3000 ? '...' : ''}

Based on the content, suggest 4-6 fields that would be useful to extract. For each field, provide:
- name: a descriptive field name (snake_case)
- type: one of text, number, date, boolean, array, object
- required: true/false
- description: what this field represents

Return the response as a JSON object with this structure:
{
  "name": "Inferred Schema Name",
  "fields": [
    {
      "name": "field_name",
      "type": "text",
      "required": true,
      "description": "Field description"
    }
  ]
}
`

    // Call OpenAI for schema inference
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing documents and creating data extraction schemas. Return only valid JSON.'
        },
        {
          role: 'user',
          content: inferencePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const inferredSchema = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      schema: inferredSchema,
      inferredAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Schema inference error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Detailed error:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json({ 
      success: false, 
      error: `Schema inference failed: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Check server logs for details'
    }, { status: 500 })
  }
}