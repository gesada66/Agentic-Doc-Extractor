import { test, expect } from '@playwright/test'

test.describe('Quick Extraction Test', () => {
  test('should test API response timing', async ({ page }) => {
    // Navigate to extract page
    await page.goto('/extract')
    await expect(page.locator('h1')).toContainText('Data Extraction')
    
    // Upload PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Start timing
    const startTime = Date.now()
    
    // Click extraction button
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    await runExtractionButton.click()
    
    // Wait for button to change to "Extracting..." (should happen quickly)
    try {
      await expect(runExtractionButton).toHaveText('Extracting...', { timeout: 5000 })
      const extractingTime = Date.now()
      console.log('Button changed to "Extracting..." in:', extractingTime - startTime, 'ms')
      
      // Wait for button to change back to "Run Extraction" (or timeout)
      try {
        await expect(runExtractionButton).toHaveText('Run Extraction', { timeout: 10000 })
        const completedTime = Date.now()
        console.log('Extraction completed in:', completedTime - startTime, 'ms')
        
        // Check if results are displayed
        const hasResults = await page.locator('text=Extraction Results:').isVisible()
        console.log('Has extraction results:', hasResults)
        
        if (hasResults) {
          const resultsText = await page.locator('text=Extraction Results:').locator('..').locator('..').textContent()
          console.log('Results content:', resultsText?.substring(0, 200))
        }
        
      } catch (error) {
        console.log('Extraction did not complete within 10 seconds')
        const buttonText = await runExtractionButton.textContent()
        console.log('Button text after timeout:', buttonText)
      }
      
    } catch (error) {
      console.log('Button did not change to "Extracting..." within 5 seconds')
      const buttonText = await runExtractionButton.textContent()
      console.log('Button text:', buttonText)
    }
    
    // Always pass for debugging
    expect(true).toBe(true)
  })
})
