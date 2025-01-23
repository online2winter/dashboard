module.exports = {
plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
    flexbox: true,
    grid: 'autoplace'
    },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
}
}
