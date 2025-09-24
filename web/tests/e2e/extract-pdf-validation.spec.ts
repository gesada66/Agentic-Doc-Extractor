import { test, expect } from '@playwright/test'

test.describe('PDF Extraction Validation', () => {
  test('should extract data from real PDF file', async ({ page }) => {
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
    
    // Wait for extraction to complete (button should change from "Extracting..." back to "Run Extraction")
    await expect(runExtractionButton).toHaveText('Run Extraction', { timeout: 30000 })
    
    // Check that extraction results are displayed
    await expect(page.locator('text=Extraction Results:')).toBeVisible()
    
    // Check that we have actual values instead of null
    const resultsSection = page.locator('text=Extraction Results:').locator('..').locator('..')
    
    // Look for non-null values in the results
    const invoiceNumber = resultsSection.locator('text=invoice_number:').locator('..').locator('text=null').first()
    const totalAmount = resultsSection.locator('text=total_amount:').locator('..').locator('text=null').first()
    const dueDate = resultsSection.locator('text=due_date:').locator('..').locator('text=null').first()
    const vendorName = resultsSection.locator('text=vendor_name:').locator('..').locator('text=null').first()
    
    // At least one field should have a non-null value if extraction is working
    const hasNonNullValues = await Promise.all([
      invoiceNumber.isVisible().then(visible => !visible),
      totalAmount.isVisible().then(visible => !visible),
      dueDate.isVisible().then(visible => !visible),
      vendorName.isVisible().then(visible => !visible)
    ])
    
    // At least one field should have extracted data (not null)
    expect(hasNonNullValues.some(hasValue => hasValue)).toBeTruthy()
    
    // Check that confidence scores are displayed
    await expect(resultsSection.locator('text=85%')).toBeVisible()
  })
  
  test('should show extraction results with proper formatting', async ({ page }) => {
    // Navigate to extract page
    await page.goto('/extract')
    
    // Upload PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    
    // Wait for upload confirmation
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Run extraction on Invoice Schema
    const runExtractionButton = page.locator('button:has-text("Run Extraction")').first()
    await runExtractionButton.click()
    
    // Wait for extraction to complete
    await expect(runExtractionButton).toHaveText('Run Extraction', { timeout: 30000 })
    
    // Check that results section is properly formatted
    const resultsSection = page.locator('text=Extraction Results:').locator('..').locator('..')
    
    // Check for Copy JSON and Download buttons
    await expect(resultsSection.locator('button:has-text("📋 Copy JSON")')).toBeVisible()
    await expect(resultsSection.locator('button:has-text("💾 Download")')).toBeVisible()
    
    // Check that all expected fields are present
    await expect(resultsSection.locator('text=invoice_number:')).toBeVisible()
    await expect(resultsSection.locator('text=total_amount:')).toBeVisible()
    await expect(resultsSection.locator('text=due_date:')).toBeVisible()
    await expect(resultsSection.locator('text=vendor_name:')).toBeVisible()
  })
  
  test('should handle schema inference with real PDF', async ({ page }) => {
    // Navigate to extract page
    await page.goto('/extract')
    
    // Upload PDF file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('../pdf-samples/Data_Pipeline_Design_CheatSheet_A4.pdf')
    
    // Wait for upload confirmation
    await expect(page.locator('text=✅ Uploaded:')).toBeVisible()
    
    // Click Infer Schema button
    const inferSchemaButton = page.locator('button:has-text("Infer Schema")')
    await inferSchemaButton.click()
    
    // Wait for schema inference to complete
    await expect(page.locator('text=Inferred Schema')).toBeVisible({ timeout: 30000 })
    
    // Check that the inferred schema has fields
    const inferredSchema = page.locator('text=Inferred Schema').locator('..').locator('..')
    await expect(inferredSchema.locator('text=Fields:')).toBeVisible()
    
    // Check that we can run extraction on the inferred schema
    const runInferredExtraction = inferredSchema.locator('button:has-text("Run Extraction")')
    await runInferredExtraction.click()
    
    // Wait for extraction to complete
    await expect(runInferredExtraction).toHaveText('Run Extraction', { timeout: 30000 })
    
    // Check that results are displayed
    await expect(inferredSchema.locator('text=Extraction Results:')).toBeVisible()
  })
})
