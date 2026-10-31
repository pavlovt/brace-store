<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatPrice } from '$lib/format';
	import { cart } from '$lib/cart.svelte';
	import Rating from './Rating.svelte';

	let { product }: { product: Product } = $props();
	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function add() {
		cart.add(product);
		added = true;
		clearTimeout(timer);
		timer = setTimeout(() => (added = false), 1200);
	}
</script>

<article class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
	<a class="block aspect-square border-b border-slate-200 bg-white p-4" href="/product/{product.id}" tabindex="-1" aria-hidden="true">
		<img class="size-full bg-white object-contain" src={product.image} alt="" loading="lazy" />
	</a>
	<div class="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
		<span class="text-xs tracking-wider text-slate-500 uppercase">{product.category}</span>
		<h3 class="line-clamp-2 min-h-[2.5em] text-sm font-semibold sm:text-base">
			<a class="hover:text-brand-700" href="/product/{product.id}">{product.title}</a>
		</h3>
		<Rating rate={product.rating.rate} count={product.rating.count} />
		<div class="mt-auto flex flex-col gap-2.5 pt-2">
			<span class="text-lg font-bold">{formatPrice(product.price)}</span>
			<button
				class="w-full cursor-pointer rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-700 active:translate-y-px"
				type="button"
				onclick={add}
			>
				{added ? 'Added' : 'Add to cart'}
			</button>
		</div>
	</div>
</article>
