import adapter from '@sveltejs/adapter-node';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		sveltePreprocess({
			scss: {
				// prependData: "@import 'src/styles/_variables.scss'; @import 'src/styles/_utilities.scss';"
			}
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$styles: 'src/styles',
			$stores: 'src/stores',
			$types: 'src/types'
		}
	}
};

export default config;
