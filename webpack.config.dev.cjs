/* eslint-disable import/no-commonjs */
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpack = require('webpack')
const dotenv = require('dotenv')
const path = require('path')
const env = dotenv.config().parsed
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[next] = JSON.stringify(env[next])
	return prev
}, {})

module.exports = {
	entry: './client/index.js',
	mode: 'development',
	devtool: 'eval-source-map',
	output: {
		path: path.join(__dirname, 'server/public/dist'),
		filename: './js/[name].[chunkhash].js',
		chunkFilename: './js/[name].[chunkhash].chunk.js',
		publicPath: '/',
	},
	devServer: {
		historyApiFallback: true,
		port: 3002,
		open: true,
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				query: {
					plugins: ['lodash'],
					presets: [
						['@babel/preset-env', { modules: false, targets: { node: 4 } }],
					],
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.(eot|woff|woff2|[ot]tf)$/,
				use: {
					loader: 'file-loader?limit=100000&name=[name].[ext]',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts',
					},
				},
			},
			{
				test: /\.(webp|svg|png|jpe?g|gif)(\?\S*)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'imgs',
						},
					},
				],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),

		new HtmlWebPackPlugin({
			template: './client/index.html',
			filename: './index.html',
			alwaysWriteToDisk: true, // this option was added by html-webpack-harddisk-plugin
		}),

		new HtmlWebpackHarddiskPlugin(),

		/** Include the env parameters as web page parameters */
		new webpack.DefinePlugin({
			'process.env': envKeys,
		}),

		new MiniCssExtractPlugin({
			filename: './css/[name].[contenthash].css',
		}),

		new CopyWebpackPlugin({
			patterns: [
				{ from: 'client/img/logo', to: 'imgs/logo' },
				'client/manifest.webmanifest',
			],
		}),

		new webpack.IgnorePlugin(/\.\/locale/, /moment/),

		new LodashModuleReplacementPlugin({
			shorthands: true,
		}),
	],
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/](!react-bootstrap)(!leaflet)(!mdbreact)(!xlsx)(!react-app-polyfill)[\\/]/,
					name: 'vendor',
				},
				xlsxVendor: {
					test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
					name: 'xlsxVendor',
				},
				reactVendor: {
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
					name: 'reactVendor',
				},
				leaflet: {
					test: /[\\/]node_modules[\\/](leaflet)[\\/]/,
					name: 'leafletVendor',
				},
				reactAppPolyfill: {
					test: /[\\/]node_modules[\\/](react-app-polyfill)[\\/]/,
					name: 'reactAppPolyfillVendor',
				},
				bootstrapVendor: {
					test: /[\\/]node_modules[\\/](react-bootstrap)[\\/]/,
					name: 'bootstrapVendor',
				},
			},
		},
		runtimeChunk: {
			name: 'runtime',
		},
	},
}
