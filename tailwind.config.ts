import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        indie: ['Indie Flower', 'cursive'],
        mono: ['Roboto Mono', 'monospace'],
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};
export default config;
