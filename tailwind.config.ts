import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f8fa',
          100: '#eaeef2',
          500: '#57606a',
          700: '#32383f',
          900: '#1f2328',
        },
        accent: {
          50: '#eef4ff',
          100: '#dbe6ff',
          500: '#2f6fed',
          600: '#1f5bd6',
          700: '#1747ab',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
