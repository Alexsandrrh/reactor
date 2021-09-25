module.exports = {
	plugins: ['stylelint-prettier', 'stylelint-order'],
	extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
	rules: { 'prettier/prettier': true },
};
