export type ParseJobStatus = 'pending' | 'running' | 'done' | 'error'

export type ParseJob = {
	id: string
	status: ParseJobStatus
	progress: number
}

export function startJob(): ParseJob {
	return { id: `job_${Math.random().toString(36).slice(2, 8)}`, status: 'pending', progress: 0 }
}

export function getStatus(id: string): ParseJob {
	return { id, status: 'done', progress: 100 }
}

export function getResults(id: string) {
	return { id, markdown: '# Parsed Document\n\nMock content', json: { title: 'Parsed Document' } }
}
