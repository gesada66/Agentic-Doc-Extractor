import type { Config } from 'jest'

const config: Config = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
	},
	testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
}

export default config
