import { test, expect } from '@playwright/test'

test.skip('rebuild index then send a chat message', async ({ page }) => {
	await page.goto('/index')
	await expect(page.getByText('Index Builder')).toBeVisible()
	await page.getByRole('button', { name: 'Rebuild Index' }).click()
	await expect(page.getByText('Index Console')).toBeVisible()
	await page.goto('/chat')
	await expect(page.getByPlaceholder('Ask something...')).toBeVisible()
	await page.getByPlaceholder('Ask something...').fill('Hello')
	await page.getByRole('button', { name: 'Send' }).click()
	await expect(page.getByText('Sources')).toBeVisible()
})
