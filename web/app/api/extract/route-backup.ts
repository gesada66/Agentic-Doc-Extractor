import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as pdf from 'pdf-parse'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { fileContent, schema } = await request.json()

    if (!fileContent) {
      return NextResponse.json({ success: false, error: 'Missing file content' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Simple fallback to pdf-parse for now
    let pdfText: string = ''
    try {
      const pdfBuffer = Buffer.from(fileContent.split(',')[1], 'base64')
      const pdfData = await pdf.default(pdfBuffer)
      pdfText = pdfData.text
    } catch (error) {
      console.error('PDF parsing error:', error)
      return NextResponse.json({ success: false, error: 'Failed to parse PDF' }, { status: 400 })
    }

    // Use OpenAI for structured extraction
    const schemaFields = Object.entries(schema.properties)
      .map(([key, value]: [string, any]) => `- ${key}: ${value.description || key}`)
      .join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting structured data from documents. Extract the following information from this document and return it as a JSON object:

${schemaFields}

Return only a valid JSON object with the extracted fields. If a field cannot be extracted, use null for that field.`
        },
        {
          role: 'user',
          content: `Document text:\n\n${pdfText.substring(0, 4000)}${pdfText.length > 4000 ? '...' : ''}`
        }
      ],
      temperature: 0.1,
    })

    const extractedData = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      data: extractedData
    })

  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json({ success: false, error: 'Extraction failed' }, { status: 500 })
  }
}
