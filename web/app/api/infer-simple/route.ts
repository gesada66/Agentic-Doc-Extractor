import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Infer API called with:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Infer API working',
      receivedData: body,
      schema: {
        name: 'Test Schema',
        fields: [
          { name: 'test_field', type: 'text', required: true, description: 'Test field' }
        ]
      }
    })
  } catch (error) {
    console.error('Infer API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Infer API failed'
    }, { status: 500 })
  }
}
