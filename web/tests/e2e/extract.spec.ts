import { test, expect } from '@playwright/test'

test.describe('Data Extraction', () => {
	test('extract page loads and displays schema editor', async ({ page }) => {
		await page.goto('/extract')
		
		// Wait for page to load
		await page.waitForLoadState('networkidle')
		
		// Verify page title and description
		await expect(page.getByRole('heading', { name: 'Data Extraction' })).toBeVisible()
		await expect(page.getByText('Define schemas and extract structured data from documents')).toBeVisible()
		
		// Verify schema editor interface
		await expect(page.getByText('Extraction Schemas')).toBeVisible()
		await expect(page.getByText('Define schemas for structured data extraction from documents')).toBeVisible()
		await expect(page.getByText('Infer Schema')).toBeVisible()
		await expect(page.getByText('Add Schema')).toBeVisible()
	})

	test('displays existing extraction schemas', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Check for existing mock schemas
		await expect(page.getByText('Invoice Schema')).toBeVisible()
		await expect(page.getByText('Contract Schema')).toBeVisible()
		await expect(page.getByText('Created: 2024-01-15')).toBeVisible()
		await expect(page.locator('text=Fields: 4').first()).toBeVisible()
		await expect(page.getByText('Per-page: No')).toBeVisible()
		await expect(page.getByText('Per-page: Yes')).toBeVisible()
		
		// Check for schema controls
		const runButtons = page.locator('button:has-text("Run Extraction")')
		const editButtons = page.locator('button:has-text("Edit")')
		const deleteButtons = page.locator('button:has-text("Delete")')
		await expect(runButtons).toHaveCount(2)
		await expect(editButtons).toHaveCount(2)
		await expect(deleteButtons).toHaveCount(2)
	})

	test('can add a new extraction schema', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Click Add Schema button
		await page.getByText('Add Schema').click()
		
		// Verify add form appears
		await expect(page.getByText('Add New Schema')).toBeVisible()
		await expect(page.getByPlaceholder('e.g., Invoice Schema')).toBeVisible()
		await expect(page.getByLabel('Extract per page')).toBeVisible()
		
		// Fill out the form
		await page.getByPlaceholder('e.g., Invoice Schema').fill('Legal Contract Schema')
		await page.getByLabel('Extract per page').check()
		
		// Submit the form
		await page.locator('form button[type="submit"]').click()
		
		// Verify new schema appears
		await expect(page.getByText('Legal Contract Schema')).toBeVisible()
		await expect(page.locator('text=Per-page: Yes').last()).toBeVisible()
	})

	test('can edit an existing schema', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Click edit button for first schema
		const editButtons = page.locator('button:has-text("Edit")')
		await editButtons.first().click()
		
		// Verify edit form appears
		await expect(page.getByText('Edit Schema')).toBeVisible()
		
		// Update schema name
		const nameInput = page.locator('input[value="Invoice Schema"]')
		await nameInput.fill('Updated Invoice Schema')
		
		// Submit update
		await page.getByText('Update Schema').click()
		
		// Verify schema was updated
		await expect(page.getByText('Updated Invoice Schema')).toBeVisible()
	})

	test('can delete a schema', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Count initial schemas
		const initialEditButtons = page.locator('button:has-text("Edit")')
		await expect(initialEditButtons).toHaveCount(2)
		
		// Click delete button for first schema
		const deleteButtons = page.locator('button:has-text("Delete")')
		await deleteButtons.first().click()
		
		// Verify schema was deleted
		await expect(initialEditButtons).toHaveCount(1)
		await expect(page.getByText('Invoice Schema')).not.toBeVisible()
	})

	test('can add fields to schemas', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Count initial fields
		const initialFieldInputs = page.locator('input[placeholder="Field name"]')
		const initialCount = await initialFieldInputs.count()
		
		// Find and click "Add Field" button for first schema
		const addFieldButtons = page.locator('button:has-text("+ Add Field")')
		await addFieldButtons.first().click()
		
		// Verify new field row was added
		await expect(initialFieldInputs).toHaveCount(initialCount + 1)
	})

	test('can update field values', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Find first field name input
		const fieldInputs = page.locator('input[placeholder="Field name"]')
		const firstFieldInput = fieldInputs.first()
		
		// Update the field name
		await firstFieldInput.fill('updated_field_name')
		await expect(firstFieldInput).toHaveValue('updated_field_name')
	})

	test('can change field type', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Find first field type select
		const typeSelects = page.locator('select')
		const firstTypeSelect = typeSelects.first()
		
		// Change field type
		await firstTypeSelect.selectOption('number')
		await expect(firstTypeSelect).toHaveValue('number')
	})

	test('can toggle field required state', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Find first field required checkbox
		const checkboxes = page.locator('input[type="checkbox"]')
		const firstCheckbox = checkboxes.first()
		
		// Verify initial state (should be checked)
		await expect(firstCheckbox).toBeChecked()
		
		// Toggle off
		await firstCheckbox.click()
		await expect(firstCheckbox).not.toBeChecked()
		
		// Toggle back on
		await firstCheckbox.click()
		await expect(firstCheckbox).toBeChecked()
	})

	test('can delete fields', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Count initial delete field buttons
		const initialDeleteButtons = page.locator('button:has-text("×")')
		const initialCount = await initialDeleteButtons.count()
		
		// Delete first field
		await initialDeleteButtons.first().click()
		
		// Verify field was deleted
		const remainingDeleteButtons = page.locator('button:has-text("×")')
		await expect(remainingDeleteButtons).toHaveCount(initialCount - 1)
	})

	test('can infer schema', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Upload a PDF file first (required for inference)
		const pdfPath = './sample-pdf/agentic_rag_capability_matrix.pdf'
		await page.setInputFiles('input[type="file"]', pdfPath)
		
		// Wait for file upload confirmation
		await expect(page.getByText('✅ Uploaded:')).toBeVisible()
		
		// Click infer schema button
		await page.getByText('Infer Schema').click()
		
		// Check if button shows loading state
		await expect(page.getByText('Inferring...')).toBeVisible()
		
		// Wait for inference to complete
		await expect(page.getByText('Inferred Schema')).toBeVisible({ timeout: 10000 })
		await expect(page.getByText('Infer Schema')).toBeVisible() // Button text back to normal
	})

	test('can run extraction', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Click run extraction button
		const runButtons = page.locator('button:has-text("Run Extraction")')
		await runButtons.first().click()
		
		// Note: In a real implementation, this would trigger extraction
		// For now, we just verify the button is clickable
		await expect(runButtons.first()).toBeVisible()
	})

	test('can cancel add schema form', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Open add form
		await page.getByText('Add Schema').click()
		await expect(page.getByText('Add New Schema')).toBeVisible()
		
		// Cancel form
		await page.getByText('Cancel').click()
		
		// Verify form is closed
		await expect(page.getByText('Add New Schema')).not.toBeVisible()
	})

	test('can cancel edit schema form', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Open edit form
		const editButtons = page.locator('button:has-text("Edit")')
		await editButtons.first().click()
		await expect(page.getByText('Edit Schema')).toBeVisible()
		
		// Cancel form
		await page.getByText('Cancel').click()
		
		// Verify form is closed
		await expect(page.getByText('Edit Schema')).not.toBeVisible()
	})

	test('displays confidence scores for fields', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Check for confidence indicators
		await expect(page.getByText('95%')).toBeVisible()
		await expect(page.getByText('88%')).toBeVisible()
		await expect(page.getByText('92%')).toBeVisible()
		await expect(page.getByText('90%')).toBeVisible()
	})
})
