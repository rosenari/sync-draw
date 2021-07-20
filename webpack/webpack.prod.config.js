const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

//production mode : 압축,난독화,번들파일 최적화 적용
module.exports = merge(common, {
    mode: 'production',
    output: {
      filename: '[name].[chunkhash:10].bundle.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:10].bundle.css'
        }),
        new CssMinimizerPlugin()
    ]
});