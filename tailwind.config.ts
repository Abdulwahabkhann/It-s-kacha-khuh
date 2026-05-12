import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#06100C',
        'app-surface': '#0D1F1A',
        'app-primary': '#059669',
        'app-secondary': '#FBBF24',
        'app-text': '#F8FAFC',
        'app-muted': '#94A3B8',
        'app-border': 'rgba(148,163,184,0.15)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.4)',
        'card-hover': '0 16px 40px rgba(0,0,0,0.6)',
        'glow-emerald': '0 0 20px rgba(5,150,105,0.4)',
        'glow-gold': '0 0 25px rgba(251,191,36,0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        badgePop: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        'fade-up': 'fadeUp 0.4s ease forwards',
        'badge-pop': 'badgePop 0.4s ease',
      },
    },
  },
  plugins: [],
}

export default config
