const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        syncdraw: './src/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader' //weakmap을 ts-loader에서 지원하지않기 때문에 추가해야함.
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '...'], //기존해석확장자 + ts
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template/index.html',
        })
    ]
}
