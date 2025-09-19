import { NextResponse } from 'next/server'
import { QueryRequest, QueryResponse } from '../../../lib/api/query'

export async function POST(request: Request): Promise<NextResponse<QueryResponse>> {
	const body = (await request.json()) as QueryRequest
	const resp: QueryResponse = {
		query: body.query,
		topK: body.topK ?? 3,
		hits: [
			{ id: 'h1', score: 0.92, source: { name: 'Policy Handbook.pdf', page: 3, excerpt: 'Policy coverage includes...' } },
			{ id: 'h2', score: 0.87, source: { name: 'Claim_2024_07.pdf', page: 1, excerpt: 'Claim submitted on...' } }
		]
	}
	return NextResponse.json(resp)
}
