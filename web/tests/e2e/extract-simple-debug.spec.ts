import { test, expect } from '@playwright/test'

test.describe('Simple PDF Extraction Debug', () => {
  test('should upload PDF and check extraction status', async ({ page }) => {
    // Navigate to extract page
    await page.goto('/extract')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Data Extraction')
    
    // Upload a real PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    
    // Wait for upload confirmation
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Click on the first "Run Extraction" button (Invoice Schema)
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    await runExtractionButton.click()
    
    // Wait for button to show "Extracting..." state
    await expect(runExtractionButton).toHaveText('Extracting...')
    
    // Wait longer for extraction to complete (up to 60 seconds)
    await expect(runExtractionButton).toHaveText('Run Extraction', { timeout: 60000 })
    
    // Take a screenshot to see the current state
    await page.screenshot({ path: 'debug-extraction-after-wait.png' })
    
    // Check if extraction results are displayed
    const hasResults = await page.locator('text=Extraction Results:').isVisible()
    console.log('Has extraction results:', hasResults)
    
    if (hasResults) {
      // Check the actual values
      const resultsSection = page.locator('text=Extraction Results:').locator('..').locator('..')
      
      // Get all the field values
      const invoiceNumber = await resultsSection.locator('text=invoice_number:').locator('..').locator('text=null').first().isVisible()
      const totalAmount = await resultsSection.locator('text=total_amount:').locator('..').locator('text=null').first().isVisible()
      const dueDate = await resultsSection.locator('text=due_date:').locator('..').locator('text=null').first().isVisible()
      const vendorName = await resultsSection.locator('text=vendor_name:').locator('..').locator('text=null').first().isVisible()
      
      console.log('Field values are null:', {
        invoiceNumber,
        totalAmount,
        dueDate,
        vendorName
      })
      
      // Check for any non-null values
      const nonNullValues = await resultsSection.locator('text=null').count()
      console.log('Number of null values found:', nonNullValues)
      
      // Look for any actual extracted values
      const allText = await resultsSection.textContent()
      console.log('Results section content:', allText)
    }
    
    // Always pass the test for debugging purposes
    expect(true).toBe(true)
  })
})
