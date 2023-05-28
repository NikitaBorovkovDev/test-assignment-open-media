import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	resolve: {
		alias: {
			src: '/src/',
		},
	},
	plugins: [
		{ enforce: 'pre', ...mdx() },
		react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
	],
	css: {
		postcss: {
			plugins: [autoprefixer({})],
		},
	},
	esbuild: {
		jsxFactory: 'React.createElement',
		jsxFragment: 'React.Fragment',
	},
});
