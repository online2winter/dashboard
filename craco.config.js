const webpack = require('webpack');
const path = require('path');

module.exports = {
webpack: {
    configure: {
    resolve: {
        fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util'),
        vm: require.resolve('vm-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib')
        },
        alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@config': path.resolve(__dirname, 'src/config')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
        })
    ]
    }
}
};
