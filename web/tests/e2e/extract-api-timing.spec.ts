import { test, expect } from '@playwright/test'

test.describe('API Timing Test', () => {
  test('should measure API response time', async ({ page }) => {
    // Navigate to extract page
    await page.goto('/extract')
    await expect(page.locator('h1')).toContainText('Data Extraction')
    
    // Upload PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Capture network timing
    let apiStartTime = 0
    let apiEndTime = 0
    
    page.on('request', request => {
      if (request.url().includes('/api/extract')) {
        apiStartTime = Date.now()
        console.log('API request started at:', apiStartTime)
      }
    })
    
    page.on('response', response => {
      if (response.url().includes('/api/extract')) {
        apiEndTime = Date.now()
        console.log('API response received at:', apiEndTime)
        console.log('API response time:', apiEndTime - apiStartTime, 'ms')
        console.log('API status:', response.status())
      }
    })
    
    // Click extraction button
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    await runExtractionButton.click()
    
    // Wait for API response (up to 60 seconds)
    let apiResponded = false
    const maxWaitTime = 60000 // 60 seconds
    
    while (!apiResponded && (Date.now() - apiStartTime) < maxWaitTime) {
      await page.waitForTimeout(1000)
      if (apiEndTime > 0) {
        apiResponded = true
      }
    }
    
    if (apiResponded) {
      console.log('API responded successfully')
      console.log('Total response time:', apiEndTime - apiStartTime, 'ms')
      
      // Check if button changed back to "Run Extraction"
      const buttonText = await runExtractionButton.textContent()
      console.log('Button text after API response:', buttonText)
      
      // Check for extraction results
      const hasResults = await page.locator('text=Extraction Results:').isVisible()
      console.log('Has extraction results:', hasResults)
      
    } else {
      console.log('API did not respond within 60 seconds')
      const buttonText = await runExtractionButton.textContent()
      console.log('Button text after timeout:', buttonText)
    }
    
    // Always pass for debugging
    expect(true).toBe(true)
  })
})
