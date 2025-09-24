import { test, expect } from '@playwright/test'

test.describe('Extraction Console Debug', () => {
  test('should capture console errors and debug extraction', async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = []
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`)
    })

    // Capture network requests
    const networkRequests: string[] = []
    page.on('request', request => {
      networkRequests.push(`${request.method()} ${request.url()}`)
    })

    // Capture network responses
    const networkResponses: string[] = []
    page.on('response', response => {
      networkResponses.push(`${response.status()} ${response.url()}`)
    })

    // Navigate to extract page
    await page.goto('/extract')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Data Extraction')
    
    console.log('Page loaded, console messages so far:', consoleMessages)
    
    // Upload a real PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    
    // Wait for upload confirmation
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    console.log('File uploaded, console messages:', consoleMessages)
    console.log('Network requests so far:', networkRequests)
    
    // Click on the first "Run Extraction" button (Invoice Schema)
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    
    console.log('About to click extraction button')
    
    // Click and immediately check for any errors
    await runExtractionButton.click()
    
    // Wait a bit to see what happens
    await page.waitForTimeout(2000)
    
    console.log('After click, console messages:', consoleMessages)
    console.log('Network requests after click:', networkRequests)
    console.log('Network responses after click:', networkResponses)
    
    // Check if button state changed
    const buttonText = await runExtractionButton.textContent()
    console.log('Button text after click:', buttonText)
    
    // Check for any error messages on the page
    const errorMessages = await page.locator('text=Error').all()
    console.log('Error messages found:', errorMessages.length)
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-extraction-console.png' })
    
    // Print all captured information
    console.log('=== CONSOLE MESSAGES ===')
    consoleMessages.forEach(msg => console.log(msg))
    
    console.log('=== NETWORK REQUESTS ===')
    networkRequests.forEach(req => console.log(req))
    
    console.log('=== NETWORK RESPONSES ===')
    networkResponses.forEach(resp => console.log(resp))
    
    // Always pass for debugging purposes
    expect(true).toBe(true)
  })
})
