export default function IndexConsole() {
	const sources = [
		{ name: 'Policy Handbook.pdf', pages: 24 },
		{ name: 'Claim_2024_07.pdf', pages: 6 },
	]
	return (
		<div className="card space-y-3">
			<div className="font-medium">Index Console</div>
			<ul className="list-disc list-inside text-sm text-[#cfe9df]">
				{sources.map((s) => (
					<li key={s.name}>{s.name} ({s.pages} pages)</li>
				))}
			</ul>
		</div>
	)
}
