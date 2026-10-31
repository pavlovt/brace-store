<script lang="ts">
	import { page } from '$app/state';
	const titles: Record<number, string> = {
		404: 'Page not found',
		503: 'Store unavailable'
	};
</script>

<svelte:head><title>{page.status} | Svelte Store</title></svelte:head>

<div class="px-4 py-16 text-center">
	<div class="text-7xl leading-none font-extrabold text-brand-500">{page.status}</div>
	<h1 class="mt-4 mb-2 text-2xl font-bold sm:text-3xl">{titles[page.status] ?? 'Something went wrong'}</h1>
	<p class="text-slate-500">
		{#if page.status === 404}
			We couldn't find what you were looking for. It may have been moved or never existed.
		{:else}
			{page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>
	<p class="mt-6">
		<a class="inline-flex rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-700" href="/">Back to the shop</a>
	</p>
</div>
