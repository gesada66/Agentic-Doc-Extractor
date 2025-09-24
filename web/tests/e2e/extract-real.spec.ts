import { test, expect } from '@playwright/test'

test.describe('Real PDF Extraction', () => {
	test('can run real extraction with OpenAI', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Upload a PDF file first
		const pdfPath = './sample-pdf/agentic_rag_capability_matrix.pdf'
		await page.setInputFiles('input[type="file"]', pdfPath)
		
		// Wait for file upload confirmation
		await expect(page.getByText('✅ Uploaded:')).toBeVisible()
		
		// Wait for schemas to load
		await expect(page.getByText('Invoice Schema')).toBeVisible()
		
		// Click Run Extraction button for first schema
		const runButtons = page.locator('button:has-text("Run Extraction")')
		await runButtons.first().click()
		
		// Wait for extraction to complete
		await expect(page.getByText('Extracting...')).toBeVisible()
		await expect(page.getByText('Extraction Results:')).toBeVisible({ timeout: 30000 })
		
		// Verify results are displayed
		await expect(page.locator('text=invoice_number:')).toBeVisible()
		await expect(page.locator('text=total_amount:')).toBeVisible()
		await expect(page.locator('text=vendor_name:')).toBeVisible()
		
		// Verify confidence scores are shown
		const confidenceElements = page.locator('[class*="bg-green-500/20"], [class*="bg-yellow-500/20"], [class*="bg-red-500/20"]')
		await expect(confidenceElements.first()).toBeVisible()
	})

	test('can infer schema from document', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Upload a PDF file first
		const pdfPath = './sample-pdf/agentic_rag_capability_matrix.pdf'
		await page.setInputFiles('input[type="file"]', pdfPath)
		
		// Wait for file upload confirmation
		await expect(page.getByText('✅ Uploaded:')).toBeVisible()
		
		// Click Infer Schema button
		await page.getByText('Infer Schema').click()
		
		// Wait for inference to complete
		await expect(page.getByText('Inferring...')).toBeVisible()
		await expect(page.getByText('Inferred Schema')).toBeVisible({ timeout: 30000 })
		
		// Verify inferred schema has fields (should be more than the initial 8 fields from existing schemas)
		const fieldInputs = page.locator('input[placeholder="Field name"]')
		const fieldCount = await fieldInputs.count()
		expect(fieldCount).toBeGreaterThan(8) // Should have more fields after inference
	})
})
