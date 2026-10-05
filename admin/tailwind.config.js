/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Backed by CSS variables so a company theme applied at runtime
          // recolors the console; hex values are fallbacks.
          50: 'var(--brand-50, #f0f7ff)',
          100: 'var(--brand-100, #e0effe)',
          200: 'var(--brand-200, #bae0fd)',
          300: 'var(--brand-300, #7cc7fb)',
          400: 'var(--brand-400, #36abf7)',
          500: 'var(--brand-500, #0c8fe9)',
          600: 'var(--brand-600, #0171c7)',
          700: 'var(--brand-700, #025aa1)',
          800: 'var(--brand-800, #064c84)',
          900: 'var(--brand-900, #0b406e)',
          950: 'var(--brand-950, #072849)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
