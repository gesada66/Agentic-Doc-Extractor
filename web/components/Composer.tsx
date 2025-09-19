'use client'

import { useState } from 'react'

export default function Composer() {
	const [text, setText] = useState('')
	function send() {
		setText('')
	}
	return (
		<div className="card flex items-center gap-2">
			<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask something..." className="flex-1 bg-transparent border border-[color:#233028] rounded px-2 py-1" />
			<button onClick={send} className="px-3 py-1 rounded bg-accent text-black glow-accent">Send</button>
		</div>
	)
}
