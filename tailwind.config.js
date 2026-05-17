/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f7fa',
        surface: '#ffffff',
        surfaceHover: '#f0f2f5',
        primary: '#4f46e5',
        primaryHover: '#4338ca',
        secondary: '#0ea5e9',
        danger: '#ef4444',
        textMain: '#1e2030',
        textMuted: '#64748b',
        border: '#e2e8f0',
      }
    },
  },
  plugins: [],
}
