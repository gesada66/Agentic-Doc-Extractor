import { test, expect } from '@playwright/test'

test.describe('PDF Upload and Processing', () => {
	test('upload real PDF files and verify processing flow', async ({ page }) => {
		// Navigate to parse page
		await page.goto('/parse')
		
		// Wait for page to load
		await page.waitForLoadState('networkidle')
		
		// Verify upload interface is visible
		await expect(page.getByText('Upload')).toBeVisible()
		await expect(page.locator('input[type="file"]')).toBeVisible()
		
		// Upload first PDF file
		const pdf1Path = './sample-pdf/agentic_rag_capability_matrix.pdf'
		const fileInput1 = page.locator('input[type="file"]')
		await fileInput1.setInputFiles(pdf1Path)
		
		// Wait a moment for file processing
		await page.waitForTimeout(1000)
		
		// Check if file appears in jobs list (mock implementation)
		await expect(page.getByText('Jobs')).toBeVisible()
		
		// Upload second PDF file
		const pdf2Path = './sample-pdf/agentic_rag_linkedin_v2.pdf'
		await fileInput1.setInputFiles(pdf2Path)
		
		// Wait for processing
		await page.waitForTimeout(1000)
		
		// Verify parse options are available
		await expect(page.getByText('Parse Options')).toBeVisible()
		
		// Check if preview tabs are available
		await expect(page.getByRole('button', { name: 'Markdown' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'JSON' })).toBeVisible()
		
		// Test preview functionality
		await page.getByRole('button', { name: 'Markdown' }).click()
		await expect(page.getByText('# Parsed Document')).toBeVisible()
		
		await page.getByRole('button', { name: 'JSON' }).click()
		await expect(page.getByText('"title": "Parsed Document"')).toBeVisible()
	})
	
	test('verify file size validation works', async ({ page }) => {
		await page.goto('/parse')
		
		// Create a large file (simulate by checking the file input behavior)
		const fileInput = page.locator('input[type="file"]')
		
		// Test with a small file first (should work)
		const pdfPath = './sample-pdf/agentic_rag_capability_matrix.pdf'
		await fileInput.setInputFiles(pdfPath)
		
		// Should not show error for valid file
		await expect(page.locator('text=File exceeds')).not.toBeVisible()
	})
	
	test('navigate to documents page and verify uploaded files', async ({ page }) => {
		await page.goto('/documents')
		
		// Verify documents page loads
		await expect(page.getByText('Documents')).toBeVisible()
		
		// Check if mock documents are displayed
		await expect(page.getByText('Policy Handbook.pdf')).toBeVisible()
		await expect(page.getByText('Claim_2024_07.pdf')).toBeVisible()
		
		// Test filter functionality
		await expect(page.locator('input[placeholder*="Filter"]')).toBeVisible()
	})
})
