/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const WEBPACK_SERVE = !!process.env.WEBPACK_SERVE;

module.exports = {
	devServer: {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		port: 3000,
	},
	devtool: DEVELOPMENT ? 'source-map' : false,
	entry: {
		index: './assets/index.js',
	},
	experiments: {
		outputModule: true,
	},
	externals: {
		'react': 'react',
		'react-dom': 'react-dom',
	},
	mode: DEVELOPMENT ? 'development' : 'production',
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
                  test: /\.jsx?$/,  // Matches .js and .jsx files
                  exclude: /node_modules/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                      },
            },
            {
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name].[hash][ext]',
				},
			},

		],
	},
	  resolve: {
        extensions: ['.js', '.jsx'], // Allow importing without specifying extension
      },
	optimization: {
		minimize: !DEVELOPMENT,
	},
	output: {
		clean: true,
		environment: {
			dynamicImport: true,
			module: true,
		},
		filename: WEBPACK_SERVE ? '[name].js' : '[name].[contenthash].js',
		library: {
			type: 'module',
		},
		path: path.resolve('build', 'static'),
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'assets', 'static'),
					to: path.resolve(__dirname, 'build', 'static'),
					noErrorOnMissing: true,
					globOptions: {
						ignore: ['**/*.js', '**/*.css', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
					},
				},
			],
		}),
	],
};
