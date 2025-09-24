import { test, expect } from '@playwright/test'

test.describe('Detailed Extraction Debug', () => {
  test('should debug the complete extraction flow', async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = []
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`)
    })

    // Capture network requests and responses
    const requests: any[] = []
    const responses: any[] = []
    
    page.on('request', request => {
      requests.push({
        method: request.method(),
        url: request.url(),
        postData: request.postData(),
        headers: request.headers()
      })
    })
    
    page.on('response', response => {
      responses.push({
        status: response.status(),
        url: response.url(),
        headers: response.headers()
      })
    })

    // Navigate to extract page
    await page.goto('/extract')
    await expect(page.locator('h1')).toContainText('Data Extraction')
    
    // Upload PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Click extraction button
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    await runExtractionButton.click()
    
    // Wait for the request to complete (up to 30 seconds)
    await page.waitForTimeout(30000)
    
    // Check button state
    const buttonText = await runExtractionButton.textContent()
    console.log('Final button text:', buttonText)
    
    // Check for extraction results
    const hasResults = await page.locator('text=Extraction Results:').isVisible()
    console.log('Has extraction results:', hasResults)
    
    // Check for any error messages
    const errorMessages = await page.locator('[class*="error"], [class*="Error"]').all()
    console.log('Error elements found:', errorMessages.length)
    
    // Print all network activity
    console.log('=== REQUESTS ===')
    requests.forEach(req => {
      if (req.url.includes('/api/extract')) {
        console.log('EXTRACT REQUEST:', JSON.stringify(req, null, 2))
      }
    })
    
    console.log('=== RESPONSES ===')
    responses.forEach(resp => {
      if (resp.url.includes('/api/extract')) {
        console.log('EXTRACT RESPONSE:', JSON.stringify(resp, null, 2))
      }
    })
    
    // Print console messages
    console.log('=== CONSOLE MESSAGES ===')
    consoleMessages.forEach(msg => console.log(msg))
    
    // Take screenshot
    await page.screenshot({ path: 'debug-detailed-extraction.png' })
    
    // Always pass for debugging
    expect(true).toBe(true)
  })
})
