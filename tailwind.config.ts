import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D5A3',
        },
        ivory: '#FAF7F0',
        ink: '#1A1208',
        muted: '#6B5C3E',
        surface: '#FFFFFF',
        error: '#C0392B',
        success: '#27AE60',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'gold-glow': '0 0 15px rgba(201, 168, 76, 0.3)',
      }
    },
  },
  plugins: [],
};

export default config;
