/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        base: {
          DEFAULT: '#08080f',
          50: '#141420',
          100: '#1a1a2e',
          200: '#24243a',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out both',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up-2': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        'slide-up-3': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both',
        'float':      'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
