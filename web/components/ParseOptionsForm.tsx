'use client'

import { useState } from 'react'

export default function ParseOptionsForm() {
	const [pages, setPages] = useState('1-5')
	const [ocr, setOcr] = useState(false)
	const [preset, setPreset] = useState('default')
	return (
		<div className="card space-y-3">
			<div className="font-medium">Parse Options</div>
			<label className="block text-sm">
				Target pages
				<input value={pages} onChange={(e) => setPages(e.target.value)} className="mt-1 w-full bg-transparent border border-[color:#233028] rounded px-2 py-1" />
			</label>
			<label className="flex items-center gap-2 text-sm">
				<input type="checkbox" checked={ocr} onChange={(e) => setOcr(e.target.checked)} />
				Enable OCR
			</label>
			<label className="block text-sm">
				Preset
				<select value={preset} onChange={(e) => setPreset(e.target.value)} className="mt-1 w-full bg-[color:#0F1511] border border-[color:#233028] rounded px-2 py-1">
					<option value="default">Default</option>
					<option value="tables">Tables</option>
					<option value="forms">Forms</option>
				</select>
			</label>
		</div>
	)
}
