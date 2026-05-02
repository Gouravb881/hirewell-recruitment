/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        surface: '#1A1A1A',
        surfaceLight: '#2A2A2A',
        primary: '#00E5A0',
        primaryHover: '#00c489',
        text: '#F5F2EC',
        textMuted: '#A0A0A0',
        error: '#EF4444',
        errorBg: '#3D1515',
        warning: '#F59E0B',
        warningBg: '#2A1F00',
        success: '#10B981',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
