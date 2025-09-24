'use client'

import { useState } from 'react'

export interface ClassificationRule {
	id: string
	name: string
	class: string
	conditions: RuleCondition[]
	enabled: boolean
}

export interface RuleCondition {
	id: string
	field: string
	operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex'
	value: string
}

export default function RulesBuilder() {
	const [rules, setRules] = useState<ClassificationRule[]>([
		{
			id: '1',
			name: 'Policy Documents',
			class: 'policy',
			enabled: true,
			conditions: [
				{ id: '1-1', field: 'filename', operator: 'contains', value: 'policy' },
				{ id: '1-2', field: 'content', operator: 'contains', value: 'terms and conditions' }
			]
		},
		{
			id: '2',
			name: 'Financial Reports',
			class: 'financial',
			enabled: true,
			conditions: [
				{ id: '2-1', field: 'filename', operator: 'contains', value: 'report' },
				{ id: '2-2', field: 'content', operator: 'contains', value: 'revenue' }
			]
		}
	])

	const [editingRule, setEditingRule] = useState<ClassificationRule | null>(null)
	const [showAddForm, setShowAddForm] = useState(false)

	const addRule = (rule: Omit<ClassificationRule, 'id'>) => {
		const newRule: ClassificationRule = {
			...rule,
			id: Date.now().toString()
		}
		setRules([...rules, newRule])
		setShowAddForm(false)
	}

	const updateRule = (id: string, updates: Partial<ClassificationRule>) => {
		setRules(rules.map(rule => 
			rule.id === id ? { ...rule, ...updates } : rule
		))
		setEditingRule(null)
	}

	const deleteRule = (id: string) => {
		setRules(rules.filter(rule => rule.id !== id))
	}

	const toggleRule = (id: string) => {
		updateRule(id, { enabled: !rules.find(r => r.id === id)?.enabled })
	}

	const addCondition = (ruleId: string) => {
		const rule = rules.find(r => r.id === ruleId)
		if (!rule) return

		const newCondition: RuleCondition = {
			id: `${ruleId}-${Date.now()}`,
			field: 'filename',
			operator: 'contains',
			value: ''
		}

		updateRule(ruleId, {
			conditions: [...rule.conditions, newCondition]
		})
	}

	const updateCondition = (ruleId: string, conditionId: string, updates: Partial<RuleCondition>) => {
		const rule = rules.find(r => r.id === ruleId)
		if (!rule) return

		const updatedConditions = rule.conditions.map(condition =>
			condition.id === conditionId ? { ...condition, ...updates } : condition
		)

		updateRule(ruleId, { conditions: updatedConditions })
	}

	const deleteCondition = (ruleId: string, conditionId: string) => {
		const rule = rules.find(r => r.id === ruleId)
		if (!rule) return

		updateRule(ruleId, {
			conditions: rule.conditions.filter(c => c.id !== conditionId)
		})
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold text-text">Classification Rules</h2>
					<p className="text-text/70 text-sm">Define rules to automatically classify documents</p>
				</div>
				<button
					onClick={() => setShowAddForm(true)}
					className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/90 transition-colors"
				>
					Add Rule
				</button>
			</div>

			{/* Rules List */}
			<div className="space-y-4">
				{rules.map((rule) => (
					<div key={rule.id} className="card">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									checked={rule.enabled}
									onChange={() => toggleRule(rule.id)}
									className="w-4 h-4 text-accent"
								/>
								<div>
									<h3 className="font-medium text-text">{rule.name}</h3>
									<p className="text-sm text-text/70">Class: {rule.class}</p>
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => setEditingRule(rule)}
									className="px-3 py-1 text-sm bg-surface border border-border rounded hover:bg-accent/10 transition-colors"
								>
									Edit
								</button>
								<button
									onClick={() => deleteRule(rule.id)}
									className="px-3 py-1 text-sm bg-warning/20 text-warning border border-warning/30 rounded hover:bg-warning/30 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>

						{/* Conditions */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-text/80">Conditions:</span>
								<button
									onClick={() => addCondition(rule.id)}
									className="px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
								>
									+ Add Condition
								</button>
							</div>
							{rule.conditions.map((condition) => (
								<div key={condition.id} className="flex items-center gap-2 p-2 bg-surface/50 rounded border border-border">
									<select
										value={condition.field}
										onChange={(e) => updateCondition(rule.id, condition.id, { field: e.target.value })}
										className="px-2 py-1 text-sm bg-background border border-border rounded"
									>
										<option value="filename">Filename</option>
										<option value="content">Content</option>
										<option value="filetype">File Type</option>
										<option value="size">File Size</option>
									</select>
									<select
										value={condition.operator}
										onChange={(e) => updateCondition(rule.id, condition.id, { operator: e.target.value as any })}
										className="px-2 py-1 text-sm bg-background border border-border rounded"
									>
										<option value="contains">Contains</option>
										<option value="equals">Equals</option>
										<option value="starts_with">Starts With</option>
										<option value="ends_with">Ends With</option>
										<option value="regex">Regex</option>
									</select>
									<input
										type="text"
										value={condition.value}
										onChange={(e) => updateCondition(rule.id, condition.id, { value: e.target.value })}
										placeholder="Value"
										className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded"
									/>
									<button
										onClick={() => deleteCondition(rule.id, condition.id)}
										className="px-2 py-1 text-xs text-warning hover:bg-warning/10 rounded transition-colors"
									>
										×
									</button>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Add Rule Form */}
			{showAddForm && (
				<AddRuleForm
					onAdd={addRule}
					onCancel={() => setShowAddForm(false)}
				/>
			)}

			{/* Edit Rule Form */}
			{editingRule && (
				<EditRuleForm
					rule={editingRule}
					onUpdate={updateRule}
					onCancel={() => setEditingRule(null)}
				/>
			)}
		</div>
	)
}

function AddRuleForm({ onAdd, onCancel }: { onAdd: (rule: Omit<ClassificationRule, 'id'>) => void, onCancel: () => void }) {
	const [formData, setFormData] = useState({
		name: '',
		class: '',
		enabled: true
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (formData.name && formData.class) {
			onAdd({
				...formData,
				conditions: []
			})
		}
	}

	return (
		<div className="card">
			<h3 className="font-medium text-text mb-4">Add New Rule</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Rule Name</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						placeholder="e.g., Policy Documents"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Classification Class</label>
					<input
						type="text"
						value={formData.class}
						onChange={(e) => setFormData({ ...formData, class: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						placeholder="e.g., policy"
						required
					/>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="enabled"
						checked={formData.enabled}
						onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
						className="w-4 h-4 text-accent"
					/>
					<label htmlFor="enabled" className="text-sm text-text/80">Enable rule</label>
				</div>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
					>
						Add Rule
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

function EditRuleForm({ rule, onUpdate, onCancel }: { rule: ClassificationRule, onUpdate: (id: string, updates: Partial<ClassificationRule>) => void, onCancel: () => void }) {
	const [formData, setFormData] = useState({
		name: rule.name,
		class: rule.class,
		enabled: rule.enabled
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onUpdate(rule.id, formData)
	}

	return (
		<div className="card">
			<h3 className="font-medium text-text mb-4">Edit Rule</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Rule Name</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-text/80 mb-1">Classification Class</label>
					<input
						type="text"
						value={formData.class}
						onChange={(e) => setFormData({ ...formData, class: e.target.value })}
						className="w-full px-3 py-2 bg-background border border-border rounded"
						required
					/>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="enabled-edit"
						checked={formData.enabled}
						onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
						className="w-4 h-4 text-accent"
					/>
					<label htmlFor="enabled-edit" className="text-sm text-text/80">Enable rule</label>
				</div>
				<div className="flex gap-2">
					<button
						type="submit"
						className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
					>
						Update Rule
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
