const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//development mode : 소스맵 제공
module.exports = merge(common,{
    mode: 'development',
    devServer: {
        port: 3000 //디버깅시 웹팩 데브 서버를 이용함 (포트설정)
    },
    output: {
        path: path.join(__dirname,'..','dist'),
        filename: '[name].bundle.js'
    },
    plugins: [new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
    })],
});