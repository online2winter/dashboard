const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
webpack: {
configure: (webpackConfig) => {
    const filteredPlugins = webpackConfig.plugins.filter(
    plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
    );

    return {
    ...webpackConfig,
        resolve: {
        ...webpackConfig.resolve,
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            assert: require.resolve('assert'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            url: require.resolve('url'),
            buffer: require.resolve('buffer'),
            util: require.resolve('util'),
            vm: require.resolve('vm-browserify'),
            path: require.resolve('path-browserify'),
            zlib: require.resolve('browserify-zlib'),
            process: false,
            dns: false,
            net: false,
            tls: false,
            fs: false,
            child_process: false
        },
        alias: {
            '@/components': path.resolve(__dirname, 'src/components'),
            '@/context': path.resolve(__dirname, 'src/context'),
            '@/utils': path.resolve(__dirname, 'src/utils'),
            '@/hooks': path.resolve(__dirname, 'src/hooks'),
            '@/services': path.resolve(__dirname, 'src/services'),
            '@/config': path.resolve(__dirname, 'src/config')
        }
        },
        plugins: [
        ...filteredPlugins,
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            eslintPath: require.resolve('eslint'),
            failOnError: false,
            emitWarning: true,
            failOnWarning: false,
        }),
        new webpack.ProvidePlugin({
            process: require.resolve('process/browser'),
            Buffer: ['buffer', 'Buffer']
        })
        ],
        optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        }
        }
    };
    }
}
};
