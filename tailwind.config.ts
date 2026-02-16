import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        card: '#1e293b',
        text: '#f8fafc',
        accent: '#38bdf8',
        work: '#22c55e',
        shoulder: '#eab308',
        sleep: '#334155'
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(56, 189, 248, 0.6), 0 0 28px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
