export interface ExtractionRequest {
  schemaId: string
  documentId?: string
  perPage: boolean
  fileContent: string // Base64 encoded file content
  schema: any // The extraction schema
}

export interface ExtractionResponse {
  success: boolean
  data: Record<string, { value: any; confidence: number }>
  schema: any
  extractedAt: string
  error?: string
}

export async function runExtraction(request: ExtractionRequest): Promise<ExtractionResponse> {
  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Extraction failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Extraction error:', error)
    throw error
  }
}

export async function inferSchemaFromDocument(fileContent: string): Promise<any> {
  try {
    const response = await fetch('/api/infer-llamaindex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileContent }),
    })

    if (!response.ok) {
      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text()
        console.error('Received HTML response instead of JSON:', htmlText.substring(0, 200))
        throw new Error('Server returned HTML error page instead of JSON. Check if the API route is properly configured.')
      }
      
      const errorData = await response.json()
      throw new Error(errorData.error || 'Schema inference failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Schema inference error:', error)
    throw error
  }
}
