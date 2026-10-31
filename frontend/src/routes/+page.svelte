<script lang="ts">
	import ProductCard from '$lib/ProductCard.svelte';

	let { data } = $props();

	function chipHref(cat: string) {
		const qs = new URLSearchParams();
		if (cat) qs.set('category', cat);
		if (data.search) qs.set('search', data.search);
		if (data.sort) qs.set('sort', data.sort);
		const s = qs.toString();
		return s ? `/?${s}` : '/';
	}
	const chip = (active: boolean) =>
		'rounded-full border px-3.5 py-1.5 text-sm capitalize transition ' +
		(active ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white hover:border-brand-500');
</script>

<template lang="braceml">
	svelte:head > title 'Svelte Store'

	h1 class="mb-4 text-2xl font-bold sm:text-3xl" 'Shop'

	form class="mb-4 flex flex-wrap gap-3" method=GET action=/ role=search {
		if data.category {
			input type=hidden name=category value={data.category}
		}
		div class="min-w-64 flex-1" {
			input class="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500" type=search name=search placeholder="Search products..." aria-label="Search products" value={data.search}
		}
		select class="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 sm:w-auto" name=sort aria-label="Sort by" value={data.sort} {
			option value="" 'Sort: Featured'
			option value=price_asc 'Price: low to high'
			option value=price_desc 'Price: high to low'
			option value=rating 'Top rated'
		}
		button class="cursor-pointer rounded-lg bg-brand-500 px-5 py-2 font-semibold text-white hover:bg-brand-700" type=submit 'Apply'
	}

	nav class="mb-5 flex flex-wrap gap-2" aria-label="Categories" {
		a class={chip(!data.category)} href={chipHref('')} aria-current={!data.category ? 'true' : undefined} 'All'
		each data.categories as cat (cat) {
			a class={chip(data.category === cat)} href={chipHref(cat)} aria-current={data.category === cat ? 'true' : undefined} '{cat}'
		}
	}

	if data.products.length {
		p class="mb-3 text-sm text-slate-500" "{data.products.length} product{data.products.length === 1 ? '' : 's'}"
		div class="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" {
			each data.products as product (product.id) {
				ProductCard product={product}
			}
		}
	} else {
		div class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center" {
			h2 class="mb-1 text-xl font-bold" 'No products found'
			p class="mb-4 text-slate-500" 'Try a different search or category.'
			a class="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50" href=/ 'Clear filters'
		}
	}
</template>
