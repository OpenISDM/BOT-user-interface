const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path')


module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: '/',
    },

    module: {
        rules: [
            {
                /**'/' 是 JS 正則表達式標記
                 * '.' 是正則表達式關鍵字，所以前面要加個 '\' 讓正則表達式以字元方式處理
                 * '|' 是 '或' 的意思
                 * '$' 是字串結束符號
                 * 整體意思是找檔名末尾是 .js 或 .jsx 的
                */
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                {
                    loader: "html-loader"
                }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                use: [
                {
                    loader: 'file-loader',
                    options: {},
                },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            { 
                test: /\.(woff|woff2|eot|ttf)$/, 
                loader: 'url-loader?limit=100000' 
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};