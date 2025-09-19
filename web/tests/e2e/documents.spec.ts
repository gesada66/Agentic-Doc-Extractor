import { test, expect } from '@playwright/test'

test('documents grid renders and preview drawer placeholder visible', async ({ page }) => {
	await page.goto('/documents')
	await expect(page.getByText('Preview drawer (select a document to preview).')).toBeVisible()
})
