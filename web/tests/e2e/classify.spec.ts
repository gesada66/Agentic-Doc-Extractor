import { test, expect } from '@playwright/test'

test.describe('Document Classification', () => {
	test('classify page loads and displays rules builder', async ({ page }) => {
		await page.goto('/classify')
		
		// Wait for page to load
		await page.waitForLoadState('networkidle')
		
		// Verify page title and description
		await expect(page.getByText('Document Classification')).toBeVisible()
		await expect(page.getByText('Automatically classify documents using custom rules')).toBeVisible()
		
		// Verify rules builder interface
		await expect(page.getByText('Classification Rules')).toBeVisible()
		await expect(page.getByText('Define rules to automatically classify documents')).toBeVisible()
		await expect(page.getByText('Add Rule')).toBeVisible()
	})

	test('displays existing classification rules', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Check for existing mock rules
		await expect(page.getByText('Policy Documents')).toBeVisible()
		await expect(page.getByText('Financial Reports')).toBeVisible()
		await expect(page.getByText('Class: policy')).toBeVisible()
		await expect(page.getByText('Class: financial')).toBeVisible()
		
		// Check for rule controls
		const editButtons = page.locator('button:has-text("Edit")')
		const deleteButtons = page.locator('button:has-text("Delete")')
		await expect(editButtons).toHaveCount(2)
		await expect(deleteButtons).toHaveCount(2)
	})

	test('can add a new classification rule', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Click Add Rule button
		await page.getByText('Add Rule').click()
		
		// Verify add form appears
		await expect(page.getByText('Add New Rule')).toBeVisible()
		await expect(page.locator('input[placeholder="e.g., Policy Documents"]')).toBeVisible()
		await expect(page.locator('input[placeholder="e.g., policy"]')).toBeVisible()
		
		// Fill out the form
		await page.locator('input[placeholder="e.g., Policy Documents"]').fill('Legal Documents')
		await page.locator('input[placeholder="e.g., policy"]').fill('legal')
		
		// Submit the form (use the submit button in the form)
		await page.locator('form button[type="submit"]').click()
		
		// Verify new rule appears
		await expect(page.getByText('Legal Documents')).toBeVisible()
		await expect(page.getByText('Class: legal')).toBeVisible()
	})

	test('can edit an existing rule', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Click edit button for first rule
		const editButtons = page.locator('button:has-text("Edit")')
		await editButtons.first().click()
		
		// Verify edit form appears
		await expect(page.getByText('Edit Rule')).toBeVisible()
		
		// Update rule name
		const nameInput = page.locator('input[value="Policy Documents"]')
		await nameInput.fill('Updated Policy Documents')
		
		// Submit update
		await page.getByText('Update Rule').click()
		
		// Verify rule was updated
		await expect(page.getByText('Updated Policy Documents')).toBeVisible()
	})

	test('can delete a rule', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Count initial rules
		const initialEditButtons = page.locator('button:has-text("Edit")')
		await expect(initialEditButtons).toHaveCount(2)
		
		// Click delete button for first rule
		const deleteButtons = page.locator('button:has-text("Delete")')
		await deleteButtons.first().click()
		
		// Verify rule was deleted
		await expect(initialEditButtons).toHaveCount(1)
		await expect(page.getByText('Policy Documents')).not.toBeVisible()
	})

	test('can toggle rule enabled state', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Find first rule checkbox
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

	test('can add conditions to rules', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Count initial conditions
		const initialConditionRows = page.locator('input[placeholder="Value"]')
		const initialCount = await initialConditionRows.count()
		
		// Find and click "Add Condition" button for first rule
		const addConditionButtons = page.locator('button:has-text("+ Add Condition")')
		await addConditionButtons.first().click()
		
		// Verify new condition row was added
		await expect(initialConditionRows).toHaveCount(initialCount + 1)
	})

	test('can update condition values', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Find first condition value input
		const valueInputs = page.locator('input[placeholder="Value"]')
		const firstValueInput = valueInputs.first()
		
		// Update the value
		await firstValueInput.fill('updated test value')
		await expect(firstValueInput).toHaveValue('updated test value')
	})

	test('can delete conditions', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Count initial conditions
		const initialDeleteButtons = page.locator('button:has-text("×")')
		const initialCount = await initialDeleteButtons.count()
		
		// Delete first condition
		await initialDeleteButtons.first().click()
		
		// Verify condition was deleted
		const remainingDeleteButtons = page.locator('button:has-text("×")')
		await expect(remainingDeleteButtons).toHaveCount(initialCount - 1)
	})

	test('can cancel add rule form', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Open add form
		await page.getByText('Add Rule').click()
		await expect(page.getByText('Add New Rule')).toBeVisible()
		
		// Cancel form
		await page.getByText('Cancel').click()
		
		// Verify form is closed
		await expect(page.getByText('Add New Rule')).not.toBeVisible()
	})

	test('can cancel edit rule form', async ({ page }) => {
		await page.goto('/classify')
		await page.waitForLoadState('networkidle')
		
		// Open edit form
		const editButtons = page.locator('button:has-text("Edit")')
		await editButtons.first().click()
		await expect(page.getByText('Edit Rule')).toBeVisible()
		
		// Cancel form
		await page.getByText('Cancel').click()
		
		// Verify form is closed
		await expect(page.getByText('Edit Rule')).not.toBeVisible()
	})
})
