import { defineConfig } from '@playwright/test'

export default defineConfig({
	reporter: 'list',
	testDir: './tests/e2e',
	use: {
		baseURL: 'http://localhost:3000',
		headless: false,
	},
	webServer: {
		command: 'npm run dev',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
})
