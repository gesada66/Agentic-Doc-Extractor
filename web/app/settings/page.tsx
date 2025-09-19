'use client'

import { useState } from 'react'

export default function SettingsPage() {
	const [tab, setTab] = useState<'profile' | 'models' | 'limits' | 'theme'>('profile')
	return (
		<div className="space-y-4">
			<div className="card flex gap-2">
				{['profile', 'models', 'limits', 'theme'].map((t) => (
					<button key={t} className={`px-3 py-1 rounded ${tab === t ? 'bg-accent text-black' : 'bg-[color:#0F1511]'}`} onClick={() => setTab(t as any)}>
						{t}
					</button>
				))}
			</div>
			<div className="card min-h-40">
				{tab === 'profile' && <div>Profile settings (mock)</div>}
				{tab === 'models' && <div>Models defaults (mock)</div>}
				{tab === 'limits' && <div>Ingestion limits (mock)</div>}
				{tab === 'theme' && <div>Theme is locked to dark.</div>}
			</div>
		</div>
	)
}
