/* eslint-disable import/no-commonjs */
module.exports = async (env, argv) => {
	const config = await import('./webpack.config.cjs')
	return config.default(env, argv)
}
