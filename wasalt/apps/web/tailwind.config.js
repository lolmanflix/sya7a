/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wasalt: {
          primary: 'var(--wasalt-primary, #2563EB)',
          'primary-hover': 'var(--wasalt-primary-hover, #1D4ED8)',
          'primary-light': 'var(--wasalt-primary-light, #EFF6FF)',
          secondary: 'var(--wasalt-secondary, #0D9488)',
          accent: 'var(--wasalt-accent, #F59E0B)',
          background: 'var(--wasalt-background, #F8FAFC)',
          surface: 'var(--wasalt-surface, #FFFFFF)',
          'surface-muted': 'var(--wasalt-surface-muted, #F1F5F9)',
          text: 'var(--wasalt-text, #0F172A)',
          'text-muted': 'var(--wasalt-text-muted, #64748B)',
          border: 'var(--wasalt-border, #E2E8F0)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
