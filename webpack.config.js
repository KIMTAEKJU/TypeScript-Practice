const path = require('path');
const webpack = require('webpack');
const banner = require('./banner');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/app.tsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist')
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    process.env.NODE_ENV === 'production'
                    ? miniCssExtractPlugin.loader
                    : "style-loader" , 
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'file-loader',
                options: {
                    publicPath: './dist',
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url-loader',
                options: {
                    publicPath: './dist',
                    name: '[name].[ext]?[hash]',
                    limit: 5000 // 해당 값보다 작은 파일사이즈를 가진 파일만 url로 변경 처리
                }
            },
        ],
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            VERSION: '\"aa\"'
        }),
        new htmlWebpackPlugin({
            template: './src/index.html',
            templateParameters: {
                env: process.env.NODE_ENV === 'development' ? '개발' : ''
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true, // 빈칸 제거
                removeComments: true, // 주석 제거
            } : '',
            hash: true
        }),
        ...(process.env.NODE_ENV === 'production'
            ? [new miniCssExtractPlugin({
                filename: '[name].css'
            })]
            : []
        ),
        new CleanWebpackPlugin(),
    ]
}