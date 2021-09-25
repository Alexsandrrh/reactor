require('dotenv').config();

// Helpers
const env = process.env.NODE_ENV ?? 'development';
const isDev = env === 'development';
const isProd = env === 'production';

// Devtool
const devtool = isDev ? 'eval-cheap-source-map' : 'hidden-source-map';

// Resolve
const alias = {};
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// CSS Modules name
const localIdentName = isDev
	? '[name]__[local]__[hash:base64:4]'
	: '[hash:base64:6]';

// Options of define plugin
function createOptionsDefine(target) {
	let output = {};
	const { env } = process;

	for (const key of Object.keys(env)) {
		output[`process.env.${key}`] = env[key];
	}

	output = {
		...output,
		IS_DEV: isDev,
		IS_PROD: isProd,
		IS_SERVER: target === 'server',
		IS_APP: target === 'app',
	};

	for (const item of Object.keys(output)) {
		output[item] = JSON.stringify(output[item]);
	}

	return output;
}

// Generator path
const createPath = (dirname) =>
	isDev
		? `assets/${dirname}/[name].[ext]`
		: `assets/${dirname}/[contenthash:12].[ext]`;

module.exports = {
	env,
	isDev,
	isProd,
	devtool,
	alias,
	extensions,
	localIdentName,
	createOptionsDefine,
	createPath,
};
