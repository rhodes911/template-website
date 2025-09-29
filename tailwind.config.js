/** @type {import('tailwindcss').Config} */

// Import our centralized colors - SINGLE SOURCE OF TRUTH
const { colors } = require('./src/lib/colors.js');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use colors directly from our shared colors file
        primary: colors.primary,
        neutral: colors.neutral,
        accent: colors.accent,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #111827, #ea580c, #111827)',
        'gradient-hero': 'linear-gradient(to bottom right, #f9fafb, #ffffff, #fff7ed)',
        'gradient-card': 'linear-gradient(to bottom right, #ffffff, #fff7ed)',
        'gradient-accent': 'linear-gradient(to right, #f97316, #ea580c)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
