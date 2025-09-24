'use client'

import { useState } from 'react'

function Badge({ children }: { children: string }) {
	return <span className="px-2 py-0.5 rounded bg-[color:#0F1511] text-[#cfe9df] text-xs">{children}</span>
}

export default function FileList() {
	const [selectedJob, setSelectedJob] = useState<string | null>(null)
	
	const jobs = [
		{ name: 'Policy Handbook.pdf', pages: 24, status: 'Parsed', progress: 100 },
		{ name: 'Claim_2024_07.pdf', pages: 6, status: 'Indexing', progress: 65 },
		{ name: 'Scanned_Form.pdf', pages: 3, status: 'Pending', progress: 0 },
	]
	
	const handleView = (jobName: string) => {
		setSelectedJob(selectedJob === jobName ? null : jobName)
	}
	
	return (
		<div className="card">
			<div className="font-medium mb-3">Jobs</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="text-left text-[#cfe9df]">
						<tr>
							<th className="py-2">Name</th>
							<th>Pages</th>
							<th>Status</th>
							<th>Progress</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{jobs.map((j) => (
							<tr key={j.name} className="border-t border-[color:#233028]">
								<td className="py-2">{j.name}</td>
								<td>{j.pages}</td>
								<td><Badge>{j.status}</Badge></td>
								<td>{j.progress}%</td>
								<td>
									<button 
										className="text-accent hover:text-accent/80 transition-colors cursor-pointer"
										onClick={() => handleView(j.name)}
										type="button"
									>
										{selectedJob === j.name ? 'Hide' : 'View'}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			{/* Mock Preview Section */}
			{selectedJob && (
				<div className="mt-4 p-4 bg-[color:#0F1511] rounded border border-[color:#233028]">
					<div className="text-sm text-[#cfe9df] mb-2">Preview: {selectedJob}</div>
					<div className="text-xs text-[#cfe9df]/70">
						{selectedJob.includes('Policy') && 'Mock policy document content...'}
						{selectedJob.includes('Claim') && 'Mock claim document content...'}
						{selectedJob.includes('Scanned') && 'Mock scanned document content...'}
					</div>
				</div>
			)}
		</div>
	)
}
