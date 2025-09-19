/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'jsdom',
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: { jsx: 'react-jsx' } }],
	},
	testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
}
