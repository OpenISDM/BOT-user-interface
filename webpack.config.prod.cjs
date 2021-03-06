/* eslint-disable import/no-commonjs */
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = require('./config/index.cjs')
const webpack = require('webpack')
const dotenv = require('dotenv')
const path = require('path')
const env = dotenv.config().parsed
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[next] = JSON.stringify(env[next])
	return prev
}, {})

let stringReplaceOption = {}
if (envKeys.WORD_REPLACEMENT_PATIENT_TO_RESIDENT === '"true"') {
	stringReplaceOption = {
		test: /\.js$/,
		loader: 'string-replace-loader',
		include: [path.resolve(__dirname, 'client/js/locale/texts')],
		options: {
			multiple: [...config.ReplacePairs.PatientToResident],
		},
	}
}

const webpackConfig = {
	entry: './client/index.js',
	mode: 'production',
	devtool: 'none',
	output: {
		path: path.join(__dirname, 'server/public/dist'),
		filename: './js/[name].[chunkhash].js',
		chunkFilename: './js/[name].[chunkhash].chunk.js',
		publicPath: '/',
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
					{
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true,
						},
					},
				],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			stringReplaceOption,
		],
	},
	devServer: {
		historyApiFallback: true,
	},
	plugins: [
		new CleanWebpackPlugin(),

		new HtmlWebPackPlugin({
			template: './client/index.html',
			filename: './index.html',
		}),

		/** Include the env parameters as web page parameters */
		new webpack.DefinePlugin({
			'process.env': envKeys,
		}),

		/** Only introduce used moment locale package */
		new webpack.ContextReplacementPlugin(/moment[\\]locale$/, /zh|en/),

		/** Compression plugin */
		new CompressionPlugin({
			filename: '[path].br[query]',
			algorithm: 'brotliCompress',
			test: /\.(js)$/,
			compressionOptions: {
				level: 11,
			},
			// threshold: 10240,
			minRatio: 0.8,
			deleteOriginalAssets: false,
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
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true, // Must be set to true if using source-maps in production
				terserOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
					},
				},
			}),
		],
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

if (process.env.npm_config_report) {
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
