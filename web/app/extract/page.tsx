'use client'

import { useState } from 'react'
import SchemaEditor from '../../components/SchemaEditor'

export default function ExtractPage() {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [fileContent, setFileContent] = useState<string | null>(null)

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setUploadedFile(file)
		
		// Convert file to base64 for API
		const reader = new FileReader()
		reader.onload = (e) => {
			const result = e.target?.result as string
			setFileContent(result)
		}
		reader.readAsDataURL(file)
	}

	return (
		<div className="space-y-6">
			<div className="card">
				<h1 className="text-2xl font-bold text-text mb-2">Data Extraction</h1>
				<p className="text-text/70">Define schemas and extract structured data from documents using AI-powered analysis.</p>
			</div>
			
			{/* File Upload Section */}
			<div className="card">
				<h2 className="text-lg font-semibold text-text mb-3">Upload Document</h2>
				<div className="space-y-3">
					<input
						type="file"
						accept=".pdf"
						onChange={handleFileUpload}
						className="block w-full text-sm text-text/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-accent/90"
					/>
					{uploadedFile && (
						<div className="text-sm text-text/80">
							✅ Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
						</div>
					)}
				</div>
			</div>

			<SchemaEditor uploadedFileContent={fileContent} />
		</div>
	)
}
