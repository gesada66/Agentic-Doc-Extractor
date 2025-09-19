import { test, expect } from '@playwright/test'

test('only Neon Slate theme exists - no theme toggle', async ({ page }) => {
	await page.goto('/dashboard')
	
	// Wait for page to fully load
	await page.waitForLoadState('networkidle')
	
	// Verify only dark class exists (no theme classes)
	await expect(page.locator('html')).toHaveClass('dark')
	await expect(page.locator('html')).not.toHaveClass(/theme-/)
	
	// Verify no theme toggle button exists
	await expect(page.getByRole('button', { name: 'Emerald Noir' })).not.toBeVisible()
	await expect(page.getByRole('button', { name: 'Neon Slate' })).not.toBeVisible()
	
	// Verify "Futuristic startup" text is displayed
	await expect(page.getByText('Futuristic startup')).toBeVisible()
	
	// Capture screenshot of Neon Slate theme
	await expect(page).toHaveScreenshot('dashboard-neon-slate-only.png')
})
