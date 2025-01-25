/** @type {import('tailwindcss').Config} */
module.exports = {
mode: 'jit',
content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
],
theme: {
    extend: {
    colors: {
        solana: {
        green: '#14F195',
        purple: '#9945FF',
        blue: '#00C2FF',
        pink: '#FF3B9A',
        },
        primary: {
        50: '#f8f9fa',
        100: '#e9ecef',
        200: '#dee2e6',
        300: '#ced4da',
        400: '#adb5bd',
        500: '#6c757d',
        600: '#495057',
        700: '#343a40',
        800: '#212529',
        900: '#1a1d20',
        },
        gray: {
        850: '#18191A',
        },
    },
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
    },
    animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
    },
    borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem',
    },
    spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
    },
    maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
    },
    },
},
plugins: [
    require('@tailwindcss/forms')({
    strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
],
future: {
    hoverOnlyWhenSupported: true,
},
}
