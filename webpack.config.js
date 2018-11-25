const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development';

console.log(`当前为${isDev ? 'development' : 'production'}环境`);
const config = {
    mode: isDev ? 'development' : 'production',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.css', '.jsx', '.js']
    },
    devServer: {
        port: 3000,
        contentBase: './dist'
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'react app',
            template: path.resolve(__dirname, './index.html')
        })
    ]
};

if (isDev) {
    config.devServer = {
        port: 3000,
        contentBase: './dist',
        overlay: true, // 开启错误调试,
        hot: true  //是否开启hot-module-replacement
    }

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
