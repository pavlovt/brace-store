<script lang="ts">
	import Rating from '$lib/Rating.svelte';
	import { formatPrice } from '$lib/format';
	import { cart } from '$lib/cart.svelte';

	let { data } = $props();
	const p = $derived(data.product);
	let qty = $state(1);
	let added = $state(false);

	function add() {
		cart.add(p, qty);
		added = true;
		qty = 1;
	}
</script>

<svelte:head><title>{p.title} | Svelte Store</title></svelte:head>

<p class="mb-4 text-sm text-slate-500">
	<a class="hover:underline" href="/">Shop</a> / <a class="hover:underline" href="/?category={encodeURIComponent(p.category)}">{p.category}</a>
</p>

<section class="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:gap-8 md:p-6">
	<div class="aspect-square bg-white p-4"><img class="size-full bg-white object-contain" src={p.image} alt={p.title} loading="lazy" /></div>
	<div>
		<span class="text-xs tracking-wider text-slate-500 uppercase">{p.category}</span>
		<h1 class="mb-2 text-2xl font-bold sm:text-3xl">{p.title}</h1>
		<Rating rate={p.rating.rate} count={p.rating.count} />
		<div class="my-3 text-3xl font-extrabold">{formatPrice(p.price)}</div>
		<p class="text-slate-700">{p.description}</p>

		<div class="mt-5 flex flex-wrap items-center gap-3">
			<div class="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white" role="group" aria-label="Quantity">
				<button class="h-10 w-9 cursor-pointer bg-slate-50 text-lg hover:bg-slate-200" type="button" aria-label="Decrease quantity" onclick={() => (qty = Math.max(1, qty - 1))}>&minus;</button>
				<output class="min-w-10 text-center font-semibold" aria-live="polite">{qty}</output>
				<button class="h-10 w-9 cursor-pointer bg-slate-50 text-lg hover:bg-slate-200" type="button" aria-label="Increase quantity" onclick={() => (qty = Math.min(99, qty + 1))}>+</button>
			</div>
			<button class="cursor-pointer rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white hover:bg-brand-700" type="button" onclick={add}>Add to cart</button>
		</div>
		{#if added}
			<p class="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800" role="status">
				Added to your cart. <a class="font-semibold underline" href="/cart">View cart</a>
			</p>
		{/if}
	</div>
</section>
