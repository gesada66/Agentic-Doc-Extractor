import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchemaEditor from '../components/SchemaEditor'

describe('SchemaEditor', () => {
	it('renders extraction schemas interface', () => {
		render(<SchemaEditor />)
		
		expect(screen.getByText('Extraction Schemas')).toBeInTheDocument()
		expect(screen.getByText('Define schemas for structured data extraction from documents')).toBeInTheDocument()
		expect(screen.getByText('Infer Schema')).toBeInTheDocument()
		expect(screen.getByText('Add Schema')).toBeInTheDocument()
	})

	it('displays existing schemas', () => {
		render(<SchemaEditor />)
		
		expect(screen.getByText('Invoice Schema')).toBeInTheDocument()
		expect(screen.getByText('Contract Schema')).toBeInTheDocument()
		expect(screen.getByText('Created: 2024-01-15')).toBeInTheDocument()
		expect(screen.getAllByText('Fields: 4')).toHaveLength(2) // Both schemas have 4 fields
		expect(screen.getByText('Per-page: No')).toBeInTheDocument()
	})

	it('shows add schema form when Add Schema button is clicked', () => {
		render(<SchemaEditor />)
		
		const addButton = screen.getByText('Add Schema')
		fireEvent.click(addButton)
		
		expect(screen.getByText('Add New Schema')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('e.g., Invoice Schema')).toBeInTheDocument()
		expect(screen.getByLabelText('Extract per page')).toBeInTheDocument()
	})

	it('can add a new schema', async () => {
		render(<SchemaEditor />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Schema'))
		
		// Fill form
		fireEvent.change(screen.getByPlaceholderText('e.g., Invoice Schema'), { target: { value: 'Test Schema' } })
		fireEvent.click(screen.getByLabelText('Extract per page'))
		
		// Submit form by pressing Enter on the input
		const nameInput = screen.getByPlaceholderText('e.g., Invoice Schema')
		fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' })
		
		// Check if schema was added
		await waitFor(() => {
			expect(screen.getByText('Test Schema')).toBeInTheDocument()
			expect(screen.getByText('Per-page: Yes')).toBeInTheDocument()
		})
	})

	it('can edit an existing schema', async () => {
		render(<SchemaEditor />)
		
		// Click edit button for first schema
		const editButtons = screen.getAllByText('Edit')
		fireEvent.click(editButtons[0])
		
		// Check edit form appears
		expect(screen.getByText('Edit Schema')).toBeInTheDocument()
		
		// Update schema name
		const nameInput = screen.getByDisplayValue('Invoice Schema')
		fireEvent.change(nameInput, { target: { value: 'Updated Invoice Schema' } })
		
		// Submit update by pressing Enter
		fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' })
		
		// Check if schema was updated
		await waitFor(() => {
			expect(screen.getByText('Updated Invoice Schema')).toBeInTheDocument()
		})
	})

	it('can delete a schema', async () => {
		render(<SchemaEditor />)
		
		const initialSchemas = screen.getAllByText('Edit')
		expect(initialSchemas).toHaveLength(2)
		
		// Click delete button for first schema
		const deleteButtons = screen.getAllByText('Delete')
		fireEvent.click(deleteButtons[0])
		
		// Check if schema was deleted
		await waitFor(() => {
			const remainingSchemas = screen.getAllByText('Edit')
			expect(remainingSchemas).toHaveLength(1)
		})
	})

	it('can add fields to a schema', async () => {
		render(<SchemaEditor />)
		
		// Find and click "Add Field" button for first schema
		const addFieldButtons = screen.getAllByText('+ Add Field')
		fireEvent.click(addFieldButtons[0])
		
		// Check if new field row was added
		await waitFor(() => {
			const fieldInputs = screen.getAllByPlaceholderText('Field name')
			expect(fieldInputs.length).toBeGreaterThan(4) // Should have more than initial fields
		})
	})

	it('can update field values', () => {
		render(<SchemaEditor />)
		
		// Find first field name input
		const fieldInputs = screen.getAllByPlaceholderText('Field name')
		const firstFieldInput = fieldInputs[0]
		
		fireEvent.change(firstFieldInput, { target: { value: 'updated_field_name' } })
		expect(firstFieldInput).toHaveValue('updated_field_name')
	})

	it('can delete fields', async () => {
		render(<SchemaEditor />)
		
		// Find delete field buttons (×)
		const deleteFieldButtons = screen.getAllByText('×')
		const initialCount = deleteFieldButtons.length
		
		// Delete first field
		fireEvent.click(deleteFieldButtons[0])
		
		// Check if field was deleted
		await waitFor(() => {
			const remainingDeleteButtons = screen.getAllByText('×')
			expect(remainingDeleteButtons).toHaveLength(initialCount - 1)
		})
	})

	it('can toggle field required state', () => {
		render(<SchemaEditor />)
		
		const checkboxes = screen.getAllByRole('checkbox')
		const firstCheckbox = checkboxes[0]
		
		expect(firstCheckbox).toBeChecked()
		
		fireEvent.click(firstCheckbox)
		expect(firstCheckbox).not.toBeChecked()
		
		fireEvent.click(firstCheckbox)
		expect(firstCheckbox).toBeChecked()
	})

	it('can change field type', () => {
		render(<SchemaEditor />)
		
		const typeSelects = screen.getAllByRole('combobox')
		const firstTypeSelect = typeSelects[0]
		
		fireEvent.change(firstTypeSelect, { target: { value: 'number' } })
		expect(firstTypeSelect).toHaveValue('number')
	})

	it('can infer schema', async () => {
		render(<SchemaEditor />)
		
		// Click infer schema button
		fireEvent.click(screen.getByText('Infer Schema'))
		
		// Check if button shows loading state
		expect(screen.getByText('Inferring...')).toBeInTheDocument()
		
		// Wait for inference to complete
		await waitFor(() => {
			expect(screen.getByText('Inferred Schema')).toBeInTheDocument()
			expect(screen.getByText('Infer Schema')).toBeInTheDocument() // Button text back to normal
		}, { timeout: 3000 })
	})

	it('can run extraction', () => {
		render(<SchemaEditor />)
		
		// Mock console.log to verify extraction is called
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
		
		// Click run extraction button
		const runButtons = screen.getAllByText('Run Extraction')
		fireEvent.click(runButtons[0])
		
		// Check if extraction was triggered
		expect(consoleSpy).toHaveBeenCalledWith('Running extraction with schema:', 'Invoice Schema')
		
		consoleSpy.mockRestore()
	})

	it('can cancel add schema form', () => {
		render(<SchemaEditor />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Schema'))
		expect(screen.getByText('Add New Schema')).toBeInTheDocument()
		
		// Cancel form
		fireEvent.click(screen.getByText('Cancel'))
		
		// Check form is closed
		expect(screen.queryByText('Add New Schema')).not.toBeInTheDocument()
	})

	it('can cancel edit schema form', () => {
		render(<SchemaEditor />)
		
		// Open edit form
		const editButtons = screen.getAllByText('Edit')
		fireEvent.click(editButtons[0])
		expect(screen.getByText('Edit Schema')).toBeInTheDocument()
		
		// Cancel form
		fireEvent.click(screen.getByText('Cancel'))
		
		// Check form is closed
		expect(screen.queryByText('Edit Schema')).not.toBeInTheDocument()
	})

	it('validates required fields in add form', () => {
		render(<SchemaEditor />)
		
		// Open add form
		fireEvent.click(screen.getByText('Add Schema'))
		
		// Try to submit without filling required fields
		const form = screen.getByText('Add New Schema').closest('form')
		const submitButton = form?.querySelector('button[type="submit"]')
		if (submitButton) fireEvent.click(submitButton)
		
		// Form should still be visible (not submitted)
		expect(screen.getByText('Add New Schema')).toBeInTheDocument()
	})

	it('displays confidence scores for fields', () => {
		render(<SchemaEditor />)
		
		// Check for confidence indicators
		expect(screen.getByText('95%')).toBeInTheDocument()
		expect(screen.getByText('88%')).toBeInTheDocument()
		expect(screen.getByText('92%')).toBeInTheDocument()
		expect(screen.getByText('90%')).toBeInTheDocument()
	})
})
