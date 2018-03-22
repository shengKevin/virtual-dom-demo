const { resolve } = require('path');
const  webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',

        'webpack/hot/only-dev-server',

        './index.js'
    ],
    output: {
        filename:'bundle.js',

        path: resolve(__dirname, 'dist'),

        publicPath: '/'
    },

    context: resolve(__dirname, 'js'),

    devtool: 'inline-source-map',

    devServer: {
      hot: true,
      contentBase: resolve(__dirname, 'dist'),

      publicPath:'/'
    },

    module:{
        rules: [
            {
                test: /\.js/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader?modules',
                    'postcss-loader',
                ]
            },
        ]
    },
    plugins: [

        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),

    ],
};