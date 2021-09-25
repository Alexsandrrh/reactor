module.exports = {
	plugins: [
		require('postcss-preset-env')({
			stage: 4,
			autoprefixer: {
				flexbox: 'no-2009',
			},
		}),
	],
};
