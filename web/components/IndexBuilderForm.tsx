'use client'

import { useState } from 'react'

export default function IndexBuilderForm() {
	const [lastBuilt, setLastBuilt] = useState<string | null>(null)
	return (
		<div className="card space-y-3">
			<div className="font-medium">Index Builder</div>
			<button className="px-3 py-1 rounded bg-accent text-black" onClick={() => setLastBuilt(new Date().toLocaleString())}>Rebuild Index</button>
			<div className="text-sm text-[#cfe9df]">Last build: {lastBuilt ?? '—'}</div>
		</div>
	)
}
