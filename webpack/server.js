const {
	env,
	devtool,
	alias,
	localIdentName,
	extensions,
	isDev,
	createOptionsDefine,
} = require('./common');
const path = require('path');

// Plugins
const { DefinePlugin } = require('webpack');
const WebpackBar = require('webpackbar');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

const config = {
	mode: env,
	name: 'server',
	target: 'node',
	devtool,
	node: {
		__dirname: false,
		__filename: false,
	},
	entry: path.resolve('src', 'server'),
	output: {
		path: path.resolve('dist'),
		filename: 'server.js',
		library: 'commonjs2',
		publicPath: isDev ? process.env.PUBLIC_PATH : '',
	},
	externalsPresets: { node: true },
	externals: [nodeExternals()],
	resolve: {
		alias,
		extensions,
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
						plugins: [
							'@babel/plugin-transform-runtime',
							'@loadable/babel-plugin',
							'dynamic-import-node',
							'remove-webpack',
						],
					},
				},
			},
			{
				test: /\.svg$/,
				oneOf: [
					{
						resourceQuery: /inline/,
						use: {
							loader: 'file-loader',
							options: {
								name: isDev ? '[name].[ext]' : '[contenthash:8].[ext]',
								outputPath: 'assets/images/',
								emitFile: false,
							},
						},
					},
					{ use: 'svg-sprite-loader' },
				],
			},

			// Css
			{
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader',
						options: {
							modules: {
								auto: true,
								exportOnlyLocals: true,
								localIdentName,
							},
						},
					},
				],
			},
			{
				test: /\.(jpeg|jpg|png|gif|mp4|webp)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: isDev ? '[name].[ext]' : '[contenthash:8].[ext]',
						outputPath: 'assets/images/',
						emitFile: false,
					},
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'null-loader',
			},
		],
	},
	plugins: [
		new WebpackBar({
			name: 'Server',
			color: '#8EE341',
		}),
		new DefinePlugin(createOptionsDefine('server')),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve('public'),
					to: path.resolve('dist', 'public'),
					noErrorOnMissing: true,
				},
			],
		}),
		new ForkTsCheckerWebpackPlugin({}),
	],
};

if (isDev) {
	config.plugins.push(new RunScriptWebpackPlugin({ nodeArgs: ['--inspect'] }));
}

module.exports = config;
