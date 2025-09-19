export default function DashboardPage() {
	const kpis = [
		{ label: 'Docs Ingested', value: 128 },
		{ label: 'Pending Jobs', value: 3 },
		{ label: 'Chats', value: 42 },
	]
	const recent = [
		{ name: 'Policy Handbook.pdf', pages: 24, status: 'Parsed' },
		{ name: 'Claim_2024_07.pdf', pages: 6, status: 'Indexed' },
		{ name: 'Scanned_Form.pdf', pages: 3, status: 'Pending' },
	]
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{kpis.map((k) => (
					<div key={k.label} className="card">
						<div className="text-text/80 text-sm">{k.label}</div>
						<div className="text-2xl font-semibold text-accent">{k.value}</div>
					</div>
				))}
			</div>
			<div className="card h-48 flex items-center justify-center text-text/60">
				Chart placeholder
			</div>
			<div className="card">
				<div className="font-medium mb-3 text-text">Recent documents</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="text-left text-text/80">
							<tr>
								<th className="py-2">Name</th>
								<th>Pages</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{recent.map((r) => (
								<tr key={r.name} className="border-t border-border">
									<td className="py-2 text-text">{r.name}</td>
									<td className="text-text/80">{r.pages}</td>
									<td className="text-accent">{r.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
