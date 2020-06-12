const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'react-qrbtf',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js$/,
            }),
        ]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/,
        }]
    }
}