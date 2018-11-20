const webpack = require('webpack');
const path = require('path');

const config = {
    entry: path.resolve(__dirname, 'lib/index'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = config;