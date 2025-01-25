module.exports = {
plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    'postcss-preset-env': {
    features: {
        'nesting-rules': false,
        'custom-properties': false,
    },
    },
    tailwindcss: {},
    autoprefixer: {
    flexbox: true,
    grid: 'autoplace',
    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    },
    ...(process.env.NODE_ENV === 'production'
    ? {
        cssnano: {
            preset: ['default', { discardComments: { removeAll: true } }],
        },
        }
    : {}),
},
}
