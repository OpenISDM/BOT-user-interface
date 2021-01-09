/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        webpack.config.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

/* eslint-disable import/no-commonjs */
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
		path: path.join(__dirname, 'server/dist'),
		filename: './js/[name].[hash].js',
		chunkFilename: './js/[name].[hash].chunk.js',
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
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
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
	],
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
		runtimeChunk: true,
	},
}
