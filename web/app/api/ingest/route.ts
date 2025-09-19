import { NextResponse } from 'next/server'
import { IngestResponse } from '../../../lib/api/ingest'

export async function POST(): Promise<NextResponse<IngestResponse>> {
	const resp: IngestResponse = {
		jobId: `job_${Math.random().toString(36).slice(2, 8)}`,
		status: 'pending'
	}
	return NextResponse.json(resp)
}
