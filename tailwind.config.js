/** @type {import('tailwindcss').Config} */
module.exports = {
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
    },
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
    },
    animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    borderRadius: {
        xl: '1rem',
        '2xl': '2rem',
    },
    },
},
plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
],
}
