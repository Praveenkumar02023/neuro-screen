import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
            colors: {
                'app-bg': '#030712', // rich gray-black
                surface: '#0B1221', // slightly lighter for cards
                primary: {
                    400: '#38bdf8', // sky-400
                    500: '#0ea5e9', // sky-500
                    600: '#0284c7', // sky-600
                },
                accent: {
                    400: '#818cf8', // indigo-400
                    500: '#6366f1', // indigo-500
                }
            },
            animation: {
                'grid-flow': 'grid-flow 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shine': 'shine 2s linear infinite',
            },
            keyframes: {
                'grid-flow': {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(50px)' },
                },
                shine: {
                    '0%': { backgroundPosition: '200% center' },
                    '100%': { backgroundPosition: '-200% center' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
