'use client'

import { useState } from 'react'
import { runExtraction, inferSchemaFromDocument } from '../lib/api/extract'

export interface SchemaField {
	id: string
	name: string
	type: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'object'
	required: boolean
	description?: string
	confidence?: number
}

export interface ExtractionSchema {
	id: string
	name: string
	fields: SchemaField[]
	perPage: boolean
	createdAt: string
}

interface SchemaEditorProps {
	uploadedFileContent?: string | null
}

export default function SchemaEditor({ uploadedFileContent }: SchemaEditorProps) {
	// Helper functions for copying and downloading results
	const copyToClipboard = async (data: any) => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
			alert('Results copied to clipboard!')
		} catch (err) {
			console.error('Failed to copy: ', err)
			alert('Failed to copy to clipboard')
		}
	}

	const downloadResults = (data: any, schemaName: string) => {
		const jsonString = JSON.stringify(data, null, 2)
		const blob = new Blob([jsonString], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${schemaName}_extraction_results.json`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	const [schemas, setSchemas] = useState<ExtractionSchema[]>([
		{
			id: '1',
			name: 'Invoice Schema',
			perPage: false,
			createdAt: '2024-01-15',
			fields: [
				{ id: '1-1', name: 'invoice_number', type: 'text', required: true, description: 'Invoice number', confidence: 0.95 },
				{ id: '1-2', name: 'total_amount', type: 'number', required: true, description: 'Total invoice amount', confidence: 0.88 },
				{ id: '1-3', name: 'due_date', type: 'date', required: false, description: 'Payment due date', confidence: 0.92 },
				{ id: '1-4', name: 'vendor_name', type: 'text', required: true, description: 'Vendor company name', confidence: 0.90 }
			]
		},
		{
			id: '2',
			name: 'Contract Schema',
			perPage: true,
			createdAt: '2024-01-10',
			fields: [
				{ id: '2-1', name: 'contract_id', type: 'text', required: true, description: 'Contract identifier', confidence: 0.97 },
				{ id: '2-2', name: 'parties', type: 'array', required: true, description: 'Contracting parties', confidence: 0.85 },
				{ id: '2-3', name: 'effective_date', type: 'date', required: true, description: 'Contract start date', confidence: 0.93 },
				{ id: '2-4', name: 'termination_date', type: 'date', required: false, description: 'Contract end date', confidence: 0.78 }
			]
		}
	])

	const [editingSchema, setEditingSchema] = useState<ExtractionSchema | null>(null)
	const [showAddForm, setShowAddForm] = useState(false)
	const [inferring, setInferring] = useState(false)
	const [extracting, setExtracting] = useState<string | null>(null)
	const [extractionResults, setExtractionResults] = useState<Record<string, any>>({})

	const addSchema = (schema: Omit<ExtractionSchema, 'id' | 'createdAt'>) => {
		const newSchema: ExtractionSchema = {
			...schema,
			id: Date.now().toString(),
			createdAt: new Date().toISOString().split('T')[0]
		}
		setSchemas([...schemas, newSchema])
		setShowAddForm(false)
	}

	const updateSchema = (id: string, updates: Partial<ExtractionSchema>) => {
		setSchemas(schemas.map(schema => 
			schema.id === id ? { ...schema, ...updates } : schema
		))
		setEditingSchema(null)
	}

	const deleteSchema = (id: string) => {
		setSchemas(schemas.filter(schema => schema.id !== id))
	}

	const addField = (schemaId: string) => {
		const schema = schemas.find(s => s.id === schemaId)
		if (!schema) return

		const newField: SchemaField = {
			id: `${schemaId}-${Date.now()}`,
			name: '',
			type: 'text',
			required: false,
			description: ''
		}

		updateSchema(schemaId, {
			fields: [...schema.fields, newField]
		})
	}

	const updateField = (schemaId: string, fieldId: string, updates: Partial<SchemaField>) => {
		const schema = schemas.find(s => s.id === schemaId)
		if (!schema) return

		const updatedFields = schema.fields.map(field =>
			field.id === fieldId ? { ...field, ...updates } : field
		)

		updateSchema(schemaId, { fields: updatedFields })
	}

	const deleteField = (schemaId: string, fieldId: string) => {
		const schema = schemas.find(s => s.id === schemaId)
		if (!schema) return

		updateSchema(schemaId, {
			fields: schema.fields.filter(f => f.id !== fieldId)
		})
	}

	const inferSchema = async () => {
		if (!uploadedFileContent) {
			alert('Please upload a PDF file first')
			return
		}

		setInferring(true)
		try {
			const response = await inferSchemaFromDocument(uploadedFileContent)
			
			if (response.success) {
				const inferredSchema: ExtractionSchema = {
					id: Date.now().toString(),
					name: response.schema.name || 'Inferred Schema',
					perPage: false,
					createdAt: new Date().toISOString().split('T')[0],
					fields: response.schema.fields.map((field: any, index: number) => ({
						id: `${Date.now()}-${index}`,
						name: field.name,
						type: field.type,
						required: field.required,
						description: field.description,
						confidence: 0.8 // Default confidence for inferred fields
					}))
				}
				
				setSchemas([...schemas, inferredSchema])
			}
		} catch (error) {
			console.error('Schema inference failed:', error)
			// Show error to user instead of silent fallback
			alert(`Schema inference failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`)
		} finally {
			setInferring(false)
		}
	}

	const handleRunExtraction = async (schemaId: string) => {
		if (!uploadedFileContent) {
			alert('Please upload a PDF file first')
			return
		}

		const schema = schemas.find(s => s.id === schemaId)
		if (!schema) {
			alert('Schema not found')
			return
		}

		setExtracting(schemaId)
		try {
			// Convert schema fields to LlamaIndex format
			const extractionSchema = {
				type: 'object',
				properties: schema.fields.reduce((acc, field) => {
					acc[field.name] = {
						type: field.type === 'array' ? 'array' : field.type === 'object' ? 'object' : 'string',
						description: field.description || `Extracted ${field.name}`
					}
					return acc
				}, {} as Record<string, any>)
			}

			const response = await fetch('/api/extract', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fileContent: uploadedFileContent,
					schema: extractionSchema
				})
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Extraction failed')
			}

			const result = await response.json()
			console.log('Extraction API response:', result)
			
			if (result.success) {
				// Transform API results to our expected format
				const transformedResults: Record<string, { value: any; confidence: number }> = {}
				if (result.data && typeof result.data === 'object') {
					Object.entries(result.data).forEach(([key, value]) => {
						transformedResults[key] = {
							value: value,
							confidence: 0.85 // Default confidence for API results
						}
					})
				}
				
				console.log('Transformed results:', transformedResults)
				setExtractionResults(prev => ({
					...prev,
					[schemaId]: transformedResults
				}))
				console.log('Extraction results set in state')
			} else {
				console.error('Extraction API returned success: false', result)
				alert(`Extraction failed: ${result.error || 'Unknown error'}`)
			}
		} catch (error) {
			console.error('Extraction failed:', error)
			alert(`Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			setExtracting(null)
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold text-text">Extraction Schemas</h2>
					<p className="text-text/70 text-sm">Define schemas for structured data extraction from documents</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={inferSchema}
						disabled={inferring}
						className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50"
					>
						{inferring ? 'Inferring...' : 'Infer Schema'}
					</button>
					<button
						onClick={() => setShowAddForm(true)}
						className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/90 transition-colors"
					>
						Add Schema
					</button>
				</div>
			</div>

			{/* Schemas List */}
			<div className="space-y-4">
				{schemas.map((schema) => (
					<div key={schema.id} className="card">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="font-medium text-text">{schema.name}</h3>
								<div className="flex items-center gap-4 text-sm text-text/70">
									<span>Created: {schema.createdAt}</span>
									<span>Fields: {schema.fields.length}</span>
									<span>Per-page: {schema.perPage ? 'Yes' : 'No'}</span>
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleRunExtraction(schema.id)}
									disabled={extracting === schema.id}
									className="px-3 py-1 text-sm bg-accent text-black rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
								>
									{extracting === schema.id ? 'Extracting...' : 'Run Extraction'}
								</button>
								<button
									onClick={() => setEditingSchema(schema)}
									className="px-3 py-1 text-sm bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
								>
									Edit
								</button>
								<button
									onClick={() => deleteSchema(schema.id)}
									className="px-3 py-1 text-sm bg-warning/20 text-warning border border-warning/30 rounded hover:bg-warning/30 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>

						{/* Fields */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-text/80">Fields:</span>
								<button
									onClick={() => addField(schema.id)}
									className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
								>
									+ Add Field
								</button>
							</div>
							{schema.fields.map((field) => (
								<div key={field.id} className="flex items-center gap-2 p-3 bg-surface/50 rounded border border-border">
									<input
										type="text"
										value={field.name}
										onChange={(e) => updateField(schema.id, field.id, { name: e.target.value })}
										placeholder="Field name"
										className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded"
									/>
									<select
										value={field.type}
										onChange={(e) => updateField(schema.id, field.id, { type: e.target.value as any })}
										className="px-2 py-1 text-sm bg-background border border-border rounded"
									>
										<option value="text">Text</option>
										<option value="number">Number</option>
										<option value="date">Date</option>
										<option value="boolean">Boolean</option>
										<option value="array">Array</option>
										<option value="object">Object</option>
									</select>
									<input
										type="text"
										value={field.description || ''}
										onChange={(e) => updateField(schema.id, field.id, { description: e.target.value })}
										placeholder="Description"
										className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded"
									/>
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={field.required}
											onChange={(e) => updateField(schema.id, field.id, { required: e.target.checked })}
											className="w-4 h-4 text-accent"
										/>
										<span className="text-xs text-text/70">Required</span>
									</div>
									{field.confidence && (
										<div className="flex items-center gap-1">
											<span className="text-xs text-text/70">Confidence:</span>
											<span className={`text-xs px-1 py-0.5 rounded ${
												field.confidence > 0.8 ? 'bg-green-500/20 text-green-400' :
												field.confidence > 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
												'bg-red-500/20 text-red-400'
											}`}>
												{Math.round(field.confidence * 100)}%
											</span>
										</div>
									)}
									<button
										onClick={() => deleteField(schema.id, field.id)}
										className="px-2 py-1 text-xs text-warning hover:bg-warning/10 rounded transition-colors"
									>
										×
									</button>
								</div>
							))}
						</div>

						{/* Extraction Results */}
						{extractionResults[schema.id] && (
							<div className="mt-4 p-4 bg-surface/30 rounded border border-border">
								<div className="flex items-center justify-between mb-3">
									<h4 className="text-sm font-medium text-text/80">Extraction Results:</h4>
									<div className="flex gap-2">
										<button
											onClick={() => copyToClipboard(extractionResults[schema.id])}
											className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
										>
											📋 Copy JSON
										</button>
										<button
											onClick={() => downloadResults(extractionResults[schema.id], schema.name)}
											className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-colors"
										>
											💾 Download
										</button>
									</div>
								</div>
								<div className="space-y-2">
									{Object.entries(extractionResults[schema.id]).map(([fieldName, fieldData]: [string, any]) => (
										<div key={fieldName} className="flex items-center justify-between text-sm">
											<span className="text-text/70">{fieldName}:</span>
											<div className="flex items-center gap-2">
												<span className="text-text">{JSON.stringify(fieldData.value)}</span>
												<span className={`px-1 py-0.5 rounded text-xs ${
													fieldData.confidence > 0.8 ? 'bg-green-500/20 text-green-400' :
													fieldData.confidence > 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
													'bg-red-500/20 text-red-400'
												}`}>
													{Math.round(fieldData.confidence * 100)}%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Add Schema Form */}
			{showAddForm && (
				<AddSchemaForm
					onAdd={addSchema}
					onCancel={() => setShowAddForm(false)}
				/>
			)}

			{/* Edit Schema Form */}
			{editingSchema && (
				<EditSchemaForm
					schema={editingSchema}
					onUpdate={updateSchema}
					onCancel={() => setEditingSchema(null)}
				/>
			)}
		</div>
	)
}

function AddSchemaForm({ onAdd, onCancel }: { onAdd: (schema: Omit<ExtractionSchema, 'id' | 'createdAt'>) => void, onCancel: () => void }) {
	const [formData, setFormData] = useState({
		name: '',
		perPage: false
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (formData.name) {
			onAdd({
				...formData,
				fields: []
			})
		}
	}

	return (
		<div className="card">
			<h3 className="font-medium text-text mb-4">Add New Schema</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Schema Name</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						placeholder="e.g., Invoice Schema"
						required
					/>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="perPage"
						checked={formData.perPage}
						onChange={(e) => setFormData({ ...formData, perPage: e.target.checked })}
						className="w-4 h-4 text-accent"
					/>
					<label htmlFor="perPage" className="text-sm text-text/80">Extract per page</label>
				</div>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
					>
						Add Schema
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}

function EditSchemaForm({ schema, onUpdate, onCancel }: { schema: ExtractionSchema, onUpdate: (id: string, updates: Partial<ExtractionSchema>) => void, onCancel: () => void }) {
	const [formData, setFormData] = useState({
		name: schema.name,
		perPage: schema.perPage
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onUpdate(schema.id, formData)
	}

	return (
		<div className="card">
			<h3 className="font-medium text-text mb-4">Edit Schema</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Schema Name</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						required
					/>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="perPage-edit"
						checked={formData.perPage}
						onChange={(e) => setFormData({ ...formData, perPage: e.target.checked })}
						className="w-4 h-4 text-accent"
					/>
					<label htmlFor="perPage-edit" className="text-sm text-text/80">Extract per page</label>
				</div>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
					>
						Update Schema
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}
