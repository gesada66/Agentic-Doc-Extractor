import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx,css}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
        warning: 'var(--warning)',
        text: 'var(--text)'
      },
      borderColor: {
        DEFAULT: 'var(--border)'
      }
    }
  },
  plugins: []
}

export default config
