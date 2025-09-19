import { test, expect } from '@playwright/test'

test('upload fixture then see previews', async ({ page }) => {
	await page.goto('/parse')
	await expect(page.getByText('Upload')).toBeVisible()
	await expect(page.getByText('Jobs')).toBeVisible()
	await expect(page.getByText('Parse Options')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Markdown' })).toBeVisible()
	await expect(page.getByRole('button', { name: 'JSON' })).toBeVisible()
})
