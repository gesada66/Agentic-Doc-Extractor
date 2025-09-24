import { test, expect } from '@playwright/test'

test.describe('Extraction Debug', () => {
	test('debug extraction process step by step', async ({ page }) => {
		await page.goto('/extract')
		await page.waitForLoadState('networkidle')
		
		// Upload a PDF file first
		const pdfPath = './sample-pdf/agentic_rag_capability_matrix.pdf'
		await page.setInputFiles('input[type="file"]', pdfPath)
		
		// Wait for file upload confirmation
		await expect(page.getByText('✅ Uploaded:')).toBeVisible()
		
		// Wait for schemas to load
		await expect(page.getByText('Invoice Schema')).toBeVisible()
		
		// Take a screenshot before extraction
		await page.screenshot({ path: 'debug-before-extraction.png' })
		
		// Click Run Extraction button for first schema
		const runButtons = page.locator('button:has-text("Run Extraction")')
		await runButtons.first().click()
		
		// Wait for extraction to start
		await expect(page.getByText('Extracting...')).toBeVisible()
		
		// Take a screenshot during extraction
		await page.screenshot({ path: 'debug-during-extraction.png' })
		
		// Wait for extraction to complete (with longer timeout)
		await page.waitForTimeout(10000) // Wait 10 seconds
		
		// Take a screenshot after waiting
		await page.screenshot({ path: 'debug-after-wait.png' })
		
		// Check if extraction results are visible
		const extractionResults = page.getByText('Extraction Results:')
		const isVisible = await extractionResults.isVisible()
		
		if (!isVisible) {
			console.log('Extraction Results not visible, checking page content...')
			
			// Log all visible text on the page
			const allText = await page.textContent('body')
			console.log('Page content:', allText)
			
			// Check for any error messages
			const errorMessages = page.locator('[class*="error"], [class*="Error"]')
			const errorCount = await errorMessages.count()
			console.log('Error elements found:', errorCount)
			
		// Check for any console errors
		const logs = await page.evaluate(() => {
			return window.console._logs || []
		})
		console.log('Console logs:', logs)
		}
		
		// Try to find extraction results with different selectors
		const resultsSection = page.locator('[class*="bg-surface/30"]')
		const resultsCount = await resultsSection.count()
		console.log('Results sections found:', resultsCount)
		
		// Check if there are any results in the extractionResults state
		const resultsText = await page.evaluate(() => {
			// Try to access the React component state
			const reactRoot = document.querySelector('#__next')
			return reactRoot ? 'React root found' : 'No React root'
		})
		console.log('React state check:', resultsText)
	})
})
