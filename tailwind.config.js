/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        soundWave: {
          '0%, 100%': {
            height: '20%',
            opacity: '0.6',
          },
          '50%': {
            height: '100%',
            opacity: '1',
          },
        },
      },
      animation: {
        soundWave: 'soundWave 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
