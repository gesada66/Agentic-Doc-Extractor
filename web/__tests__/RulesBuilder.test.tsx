import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RulesBuilder from '../components/RulesBuilder'

describe('RulesBuilder', () => {
	it('renders classification rules interface', () => {
		render(<RulesBuilder />)
		
		expect(screen.getByText('Classification Rules')).toBeInTheDocument()
		expect(screen.getByText('Define rules to automatically classify documents')).toBeInTheDocument()
		expect(screen.getByText('Add Rule')).toBeInTheDocument()
	})

	it('displays existing rules', () => {
		render(<RulesBuilder />)
		
		expect(screen.getByText('Policy Documents')).toBeInTheDocument()
		expect(screen.getByText('Financial Reports')).toBeInTheDocument()
		expect(screen.getByText('Class: policy')).toBeInTheDocument()
		expect(screen.getByText('Class: financial')).toBeInTheDocument()
	})

	it('shows add rule form when Add Rule button is clicked', () => {
		render(<RulesBuilder />)
		
		const addButton = screen.getByText('Add Rule')
		fireEvent.click(addButton)
		
		expect(screen.getByText('Add New Rule')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('e.g., Policy Documents')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('e.g., policy')).toBeInTheDocument()
	})

	it('can add a new rule', async () => {
		render(<RulesBuilder />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Rule'))
		
		// Fill form
		fireEvent.change(screen.getByPlaceholderText('e.g., Policy Documents'), { target: { value: 'Test Rule' } })
		fireEvent.change(screen.getByPlaceholderText('e.g., policy'), { target: { value: 'test' } })
		
		// Submit form (use the submit button in the form)
		const submitButton = screen.getByDisplayValue('Test Rule').closest('form')?.querySelector('button[type="submit"]')
		if (submitButton) fireEvent.click(submitButton)
		
		// Check if rule was added
		await waitFor(() => {
			expect(screen.getByText('Test Rule')).toBeInTheDocument()
			expect(screen.getByText('Class: test')).toBeInTheDocument()
		})
	})

	it('can edit an existing rule', async () => {
		render(<RulesBuilder />)
		
		// Click edit button for first rule
		const editButtons = screen.getAllByText('Edit')
		fireEvent.click(editButtons[0])
		
		// Check edit form appears
		expect(screen.getByText('Edit Rule')).toBeInTheDocument()
		
		// Update rule name
		const nameInput = screen.getByDisplayValue('Policy Documents')
		fireEvent.change(nameInput, { target: { value: 'Updated Policy Documents' } })
		
		// Submit update
		fireEvent.click(screen.getByText('Update Rule'))
		
		// Check if rule was updated
		await waitFor(() => {
			expect(screen.getByText('Updated Policy Documents')).toBeInTheDocument()
		})
	})

	it('can delete a rule', async () => {
		render(<RulesBuilder />)
		
		const initialRules = screen.getAllByText('Edit')
		expect(initialRules).toHaveLength(2)
		
		// Click delete button for first rule
		const deleteButtons = screen.getAllByText('Delete')
		fireEvent.click(deleteButtons[0])
		
		// Check if rule was deleted
		await waitFor(() => {
			const remainingRules = screen.getAllByText('Edit')
			expect(remainingRules).toHaveLength(1)
		})
	})

	it('can toggle rule enabled state', () => {
		render(<RulesBuilder />)
		
		const checkboxes = screen.getAllByRole('checkbox')
		const firstCheckbox = checkboxes[0]
		
		expect(firstCheckbox).toBeChecked()
		
		fireEvent.click(firstCheckbox)
		expect(firstCheckbox).not.toBeChecked()
		
		fireEvent.click(firstCheckbox)
		expect(firstCheckbox).toBeChecked()
	})

	it('can add conditions to a rule', async () => {
		render(<RulesBuilder />)
		
		// Find and click "Add Condition" button for first rule
		const addConditionButtons = screen.getAllByText('+ Add Condition')
		fireEvent.click(addConditionButtons[0])
		
		// Check if new condition row was added
		await waitFor(() => {
			const conditionRows = screen.getAllByPlaceholderText('Value')
			expect(conditionRows.length).toBeGreaterThan(2) // Should have more than initial conditions
		})
	})

	it('can update condition values', () => {
		render(<RulesBuilder />)
		
		// Find first condition value input
		const valueInputs = screen.getAllByPlaceholderText('Value')
		const firstValueInput = valueInputs[0]
		
		fireEvent.change(firstValueInput, { target: { value: 'updated value' } })
		expect(firstValueInput).toHaveValue('updated value')
	})

	it('can delete conditions', async () => {
		render(<RulesBuilder />)
		
		// Find delete condition buttons (×)
		const deleteConditionButtons = screen.getAllByText('×')
		const initialCount = deleteConditionButtons.length
		
		// Delete first condition
		fireEvent.click(deleteConditionButtons[0])
		
		// Check if condition was deleted
		await waitFor(() => {
			const remainingDeleteButtons = screen.getAllByText('×')
			expect(remainingDeleteButtons).toHaveLength(initialCount - 1)
		})
	})

	it('can cancel add rule form', () => {
		render(<RulesBuilder />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Rule'))
		expect(screen.getByText('Add New Rule')).toBeInTheDocument()
		
		// Cancel form
		fireEvent.click(screen.getByText('Cancel'))
		
		// Check form is closed
		expect(screen.queryByText('Add New Rule')).not.toBeInTheDocument()
	})

	it('can cancel edit rule form', () => {
		render(<RulesBuilder />)
		
		// Open edit form
		const editButtons = screen.getAllByText('Edit')
		fireEvent.click(editButtons[0])
		expect(screen.getByText('Edit Rule')).toBeInTheDocument()
		
		// Cancel form
		fireEvent.click(screen.getByText('Cancel'))
		
		// Check form is closed
		expect(screen.queryByText('Edit Rule')).not.toBeInTheDocument()
	})

	it('validates required fields in add form', () => {
		render(<RulesBuilder />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Rule'))
		
		// Try to submit without filling required fields
		const form = screen.getByText('Add New Rule').closest('form')
		const submitButton = form?.querySelector('button[type="submit"]')
		if (submitButton) fireEvent.click(submitButton)
		
		// Form should still be visible (not submitted)
		expect(screen.getByText('Add New Rule')).toBeInTheDocument()
	})
})
