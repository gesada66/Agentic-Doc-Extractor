'use client'

import { useState } from 'react'

export default function ResultPreview() {
	const [tab, setTab] = useState<'markdown' | 'json'>('markdown')
	return (
		<div className="card">
			<div className="flex gap-2 mb-3">
				<button className={`px-3 py-1 rounded ${tab === 'markdown' ? 'bg-accent text-black' : 'bg-[color:#0F1511]'}`} onClick={() => setTab('markdown')}>Markdown</button>
				<button className={`px-3 py-1 rounded ${tab === 'json' ? 'bg-accent text-black' : 'bg-[color:#0F1511]'}`} onClick={() => setTab('json')}>JSON</button>
			</div>
			{tab === 'markdown' ? (
				<pre className="text-sm whitespace-pre-wrap"># Parsed Document\n\nThis is a mock Markdown preview.</pre>
			) : (
				<pre className="text-sm">{JSON.stringify({ title: 'Parsed Document', sections: [{ heading: 'Intro', text: 'Mock content' }] }, null, 2)}</pre>
			)}
		</div>
	)
}
