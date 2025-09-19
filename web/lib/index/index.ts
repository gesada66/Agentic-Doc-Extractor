export async function rebuild(): Promise<{ at: string }> {
	return { at: new Date().toISOString() }
}

export async function retrieve(query: string, topK: number = 3) {
	return {
		query,
		topK,
		hits: [
			{ id: 'h1', score: 0.92 },
			{ id: 'h2', score: 0.87 }
		]
	}
}
