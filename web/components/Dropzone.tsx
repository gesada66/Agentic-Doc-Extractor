'use client'

import { useState, useCallback } from 'react'

const MAX_UPLOAD_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? 50)

export default function Dropzone() {
	const [error, setError] = useState<string | null>(null)
	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const tooLarge = file.size / (1024 * 1024) > MAX_UPLOAD_MB
		if (tooLarge) {
			setError(`File exceeds ${MAX_UPLOAD_MB} MB`)
			return
		}
		setError(null)
		// mock: would post to /api/ingest
	}, [])

	return (
		<div className="card dropzone-pulse">
			<div className="mb-2 font-medium">Upload</div>
			<input type="file" onChange={onChange} className="block border border-[color:#233028] rounded px-2 py-1" />
			{error && <div className="text-warning text-sm mt-2">{error}</div>}
		</div>
	)
}
