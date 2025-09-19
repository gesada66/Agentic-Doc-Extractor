export type IngestResponse = {
	jobId: string
	status: 'pending' | 'running' | 'done' | 'error'
}
