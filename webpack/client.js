const {
	env,
	devtool,
	alias,
	localIdentName,
	extensions,
	isDev,
	isProd,
	createOptionsDefine,
} = require("./common");
const path = require("path");

// Plugins
const WebpackBar = require("webpackbar");
const LoadablePlugin = require("@loadable/webpack-plugin");
const { HotModuleReplacementPlugin, DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
	mode: env,
	name: "client",
	stats: "errors-only",
	target: "web",
	devtool,
	entry: { bundle: path.resolve("src", "client") },
	output: {
		filename: isDev
			? "assets/js/[name].js"
			: "assets/js/[name].[contenthash:8].js",
		chunkFilename: isDev
			? "assets/js/[name].chunk.js"
			: "assets/js/[name].[contenthash:8].chunk.js",
		path: path.resolve("dist", "public"),
		publicPath: isDev ? process.env.PUBLIC_PATH : "/",
	},
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
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
						plugins: [
							"@babel/plugin-transform-runtime",
							"@loadable/babel-plugin",
						].filter(Boolean),
					},
				},
			},
			{
				test: /\.svg$/,
				oneOf: [
					{
						resourceQuery: /inline/,
						use: {
							loader: "file-loader",
							options: {
								name: isDev ? "[name].[ext]" : "[contenthash:8].[ext]",
								outputPath: "assets/images/",
							},
						},
					},
					{
						use: ["svg-sprite-loader", isProd && "svgo-loader"].filter(Boolean),
					},
				],
			},

			// Sass
			{
				test: /\.(sa|sc)ss$/,
				use: [
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					"resolve-url-loader",
					{ loader: "sass-loader", options: { sourceMap: true } },
				],
			},

			// Css
			{
				test: /\.css$/,

				use: [
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							modules: {
								auto: true,
								localIdentName,
							},
							sourceMap: true,
						},
					},
					// {
					// 	loader: 'postcss-loader',
					// 	options: {
					// 		plugins: [autoprefixer()],
					// 	},
					// },
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource",
				generator: {
					filename: "assets/fonts/[contenthash:8][ext]",
				},
			},
			{
				test: /\.(jpeg|jpg|png|gif|mp4|webp)$/,
				use: {
					loader: "file-loader",
					options: {
						name: isDev ? "[name].[ext]" : "[contenthash:8].[ext]",
						outputPath: "assets/images/",
					},
				},
			},
		],
	},
	plugins: [
		new WebpackBar({
			name: "Client",
			color: "#4533C7",
		}),
		new LoadablePlugin({
			filename: "../loadable-stats.json",
			outputAsset: path.resolve("dist"),
			writeToDisk: true,
		}),
		new DefinePlugin(createOptionsDefine("client")),
	],
};

if (isDev) {
	config.devServer = {
		allowedHosts: "all",

		// Client
		client: {
			logging: "error",
			overlay: {
				errors: true,
				warnings: false,
				progress: true,
			},
		},

		compress: true,

		hot: true,
		host: process.env.DEV_SERVER_HOST,
		port: process.env.DEV_SERVER_PORT,
		watchOptions: { ignored: /node_modules/ },
	};

	config.plugins.push(new HotModuleReplacementPlugin());
}

if (isProd) {
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: "assets/css/[name].[contenthash:8].css",
			chunkFilename: "assets/css/[id].[contenthash:8].css",
		})
	);

	config.optimization = {
		...config.optimization,
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				terserOptions: {
					parse: {
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						comparisons: false,
						inline: 1,
					},
					mangle: {
						safari10: true,
					},
					output: {
						ecma: 5,
						comments: false,
						ascii_only: true,
					},
				},
			}),
		],
	};
}

module.exports = config;
