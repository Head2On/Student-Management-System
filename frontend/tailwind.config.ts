import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        domine: ['Domine', 'serif'],
        sans: ['Domine', 'serif'],
        serif: ['Domine', 'serif'],
      },
    },
  },
}

export default config