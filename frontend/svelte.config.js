import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { braceml } from '@braceml/svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// braceml() must run before vitePreprocess so <script lang="ts"> keeps working
	preprocess: [braceml(), vitePreprocess()],
	kit: { adapter: adapter() }
};

export default config;
