import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fileContent } = await request.json()

    if (!fileContent) {
      return NextResponse.json({ success: false, error: 'No file content provided' }, { status: 400 })
    }

    const LLAMAINDEX_API_KEY = process.env.LLAMAINDEX_API_KEY || process.env.LLAMA_CLOUD_API_KEY
    const LLAMAINDEX_REGION = (process.env.LLAMAINDEX_REGION || 'eu').toLowerCase()
    const LLAMA_CLOUD_BASE_URL = process.env.LLAMA_CLOUD_BASE_URL
    const LLAMAINDEX_SCHEMA_ENDPOINT = (process.env.LLAMAINDEX_SCHEMA_ENDPOINT || 'schema_generate').toLowerCase()
    const LLAMACLOUD_PROJECT_ID = process.env.LLAMACLOUD_PROJECT_ID || process.env.LLAMA_CLOUD_PROJECT_ID
    const LLAMACLOUD_ORG_ID = process.env.LLAMACLOUD_ORGANIZATION_ID || process.env.LLAMA_CLOUD_ORGANIZATION_ID
    
    if (!LLAMAINDEX_API_KEY) {
      console.error('LlamaIndex API key not configured')
      return NextResponse.json({ 
        success: false, 
        error: 'LlamaIndex API key not configured. Please set LLAMAINDEX_API_KEY environment variable.' 
      }, { status: 500 })
    }

    // Convert base64 to buffer for multipart/form-data
    const base64Data = fileContent.split(',')[1]
    const nodeBuffer = Buffer.from(base64Data, 'base64')
    const uint8 = new Uint8Array(nodeBuffer)
    const blob = new Blob([uint8], { type: 'application/pdf' })
    
    const formData = new FormData()
    formData.append('file', blob, 'document.pdf')
    
    // Calling LlamaIndex schema inference API

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    async function callEndpoint(url: string) {
      try {
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${LLAMAINDEX_API_KEY}`,
          'Accept': 'application/json',
        }
        if (LLAMACLOUD_PROJECT_ID) headers['X-Project-Id'] = LLAMACLOUD_PROJECT_ID
        if (LLAMACLOUD_ORG_ID) headers['X-Organization-Id'] = LLAMACLOUD_ORG_ID

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          signal: controller.signal,
        })
        return res
      } catch (err) {
        return new Response(String(err), { status: 599, statusText: 'Network/Timeout' }) as any
      }
    }

    async function callWithRetries(url: string, attempts: number = 3): Promise<Response> {
      let lastResponse: Response | null = null
      const delays = [300, 800, 1500]
      for (let i = 0; i < attempts; i++) {
        const res = await callEndpoint(url)
        if (res.ok) return res
        lastResponse = res
        if (i < attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[Math.min(i, delays.length - 1)]))
        }
      }
      // @ts-expect-error lastResponse will be set if attempts > 0
      return lastResponse
    }

    const defaultPath = LLAMAINDEX_SCHEMA_ENDPOINT === 'infer_schema'
      ? '/api/v1/extraction/infer_schema'
      : '/api/v1/extraction/extraction-agents/schema/generate'

    const EU_URL = `https://api.cloud.eu.llamaindex.ai${defaultPath}`
    const GLOBAL_URL = `https://api.cloud.llamaindex.ai${defaultPath}`

    // If base contains '/api/', treat it as a full endpoint
    const CUSTOM_URL = LLAMA_CLOUD_BASE_URL
      ? (LLAMA_CLOUD_BASE_URL.includes('/api/')
          ? LLAMA_CLOUD_BASE_URL.replace(/\/$/, '')
          : `${LLAMA_CLOUD_BASE_URL.replace(/\/$/, '')}${defaultPath}`)
      : undefined

    // Choose primary based on region preference
    const primaryUrl = CUSTOM_URL || (LLAMAINDEX_REGION === 'global' ? GLOBAL_URL : EU_URL)
    const secondaryUrl = CUSTOM_URL
      ? (LLAMAINDEX_REGION === 'global' ? EU_URL : GLOBAL_URL)
      : (LLAMAINDEX_REGION === 'global' ? EU_URL : GLOBAL_URL)

    let response = await callWithRetries(primaryUrl)
    if (!response.ok) {
      const euText = await response.text()
      console.warn('Primary endpoint failed after retries, trying secondary:', {
        status: response.status,
        statusText: response.statusText,
        body: euText?.slice(0, 500)
      })
      response = await callWithRetries(secondaryUrl)
      if (!response.ok) {
        clearTimeout(timeout)
        const errorText = await response.text()
        console.error('LlamaIndex schema inference failed (both endpoints):', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        return NextResponse.json({ 
          success: false, 
          error: `LlamaIndex schema inference failed: ${response.status} ${response.statusText}`,
          details: errorText || euText
        }, { status: response.status })
      }
    }

    clearTimeout(timeout)

    const result = await response.json()

    // Transform LlamaIndex response to our expected format
    const transformedSchema = {
      name: 'Inferred Schema (LlamaIndex)',
      perPage: false,
      createdAt: new Date().toISOString().split('T')[0],
      fields: result.fields?.map((field: any, index: number) => ({
        id: `llamaindex-${Date.now()}-${index}`,
        name: field.name || `field_${index}`,
        type: field.type || 'text',
        required: field.required || false,
        description: field.description || `Field ${index + 1}`,
        confidence: field.confidence || 0.8
      })) || []
    }

    return NextResponse.json({
      success: true,
      schema: transformedSchema,
      inferredAt: new Date().toISOString(),
      source: 'llamaindex'
    })

  } catch (error) {
    console.error('LlamaIndex schema inference error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      success: false, 
      error: `Schema inference failed: ${errorMessage}`,
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Check server logs for details'
    }, { status: 500 })
  }
}
