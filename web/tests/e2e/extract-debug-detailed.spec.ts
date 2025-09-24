import { test, expect } from '@playwright/test'

test.describe('Detailed Extraction Debug', () => {
	test('debug extraction with console monitoring', async ({ page }) => {
		// Listen to console messages
		const consoleMessages: string[] = []
		page.on('console', msg => {
			consoleMessages.push(`[${msg.type()}] ${msg.text()}`)
		})

		// Listen to network requests
		const networkRequests: any[] = []
		page.on('request', request => {
			if (request.url().includes('/api/extract')) {
				networkRequests.push({
					url: request.url(),
					method: request.method(),
					headers: request.headers(),
					postData: request.postData()
				})
			}
		})

		// Listen to network responses
		const networkResponses: any[] = []
		page.on('response', response => {
			if (response.url().includes('/api/extract')) {
				networkResponses.push({
					url: response.url(),
					status: response.status(),
					statusText: response.statusText()
				})
			}
		})

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
		
		// Wait for extraction to start
		await expect(page.getByText('Extracting...')).toBeVisible()
		
		// Wait for extraction to complete (with longer timeout)
		await page.waitForTimeout(15000) // Wait 15 seconds
		
		// Check console messages
		console.log('=== CONSOLE MESSAGES ===')
		consoleMessages.forEach(msg => console.log(msg))
		
		// Check network requests
		console.log('=== NETWORK REQUESTS ===')
		networkRequests.forEach(req => console.log(JSON.stringify(req, null, 2)))
		
		// Check network responses
		console.log('=== NETWORK RESPONSES ===')
		networkResponses.forEach(res => console.log(JSON.stringify(res, null, 2)))
		
		// Check if extraction results are visible
		const extractionResults = page.getByText('Extraction Results:')
		const isVisible = await extractionResults.isVisible()
		console.log('Extraction Results visible:', isVisible)
		
		// Check the extractionResults state
		const extractionResultsState = await page.evaluate(() => {
			// Try to access the React component state
			const reactRoot = document.querySelector('#__next')
			if (reactRoot) {
				// Look for any elements with extraction results
				const resultsElements = document.querySelectorAll('[class*="bg-surface/30"]')
				return {
					resultsElementsFound: resultsElements.length,
					resultsElementsText: Array.from(resultsElements).map(el => el.textContent)
				}
			}
			return { resultsElementsFound: 0, resultsElementsText: [] }
		})
		
		console.log('Extraction Results State:', extractionResultsState)
		
		// Check for any error messages in the page
		const errorElements = await page.locator('[class*="error"], [class*="Error"], .error').count()
		console.log('Error elements found:', errorElements)
		
		// Take a screenshot for visual debugging
		await page.screenshot({ path: 'debug-extraction-final.png' })
	})
})
