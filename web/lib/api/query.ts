export type QueryRequest = {
	query: string
	topK?: number
}

export type QueryHitSource = {
	name: string
	page: number
	excerpt: string
}

export type QueryHit = {
	id: string
	score: number
	source: QueryHitSource
}

export type QueryResponse = {
	query: string
	topK: number
	hits: QueryHit[]
}
