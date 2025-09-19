export default function SourcesPanel() {
	const sources = [
		{ name: 'Policy Handbook.pdf', page: 3, excerpt: 'Policy coverage includes...'},
		{ name: 'Claim_2024_07.pdf', page: 1, excerpt: 'Claim submitted on...'},
	]
	return (
		<div className="card space-y-3">
			<div className="font-medium">Sources</div>
			{sources.map((s) => (
				<div key={s.name + s.page} className="border border-[color:#233028] rounded p-2">
					<div className="text-sm font-medium">{s.name} — p.{s.page}</div>
					<div className="text-xs text-[#cfe9df]">{s.excerpt}</div>
				</div>
			))}
		</div>
	)
}
