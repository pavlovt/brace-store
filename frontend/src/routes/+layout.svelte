<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { cart } from '$lib/cart.svelte';

	let { children } = $props();

	onMount(() => {
		cart.init();
		// keep multiple tabs in sync
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'svelte-store-cart') cart.init();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});

	const path = $derived(page.url.pathname);
	const current = (prefix: string) => (prefix === '/' ? path === '/' || path.startsWith('/product') : path.startsWith(prefix));
	const link = (active: boolean) =>
		'inline-flex items-center gap-1.5 rounded-lg px-2 py-2 font-medium sm:px-3 ' +
		(active ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900');
</script>

<template lang="braceml">
	div class="flex min-h-screen flex-col" {
		header class="sticky top-0 z-10 border-b border-slate-200 bg-white" {
			div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4" {
				a class="mr-auto flex items-center gap-2 text-lg font-extrabold tracking-tight" href=/ {
					span class="grid size-8 place-items-center rounded-lg bg-brand-500 text-base text-white" aria-hidden="true" 'S'
					span 'Svelte Store'
				}
				nav class="flex items-center gap-1" aria-label="Main" {
					a class={link(current('/'))} href=/ aria-current={current('/') ? 'page' : undefined} 'Shop'
					a class={link(current('/orders'))} href=/orders aria-current={current('/orders') ? 'page' : undefined} 'Orders'
					a class={link(current('/cart'))} href=/cart aria-current={current('/cart') ? 'page' : undefined} {
						'Cart'
						if cart.count > 0 {
							span class="inline-grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white" aria-label="{cart.count} items in cart" '{cart.count}'
						}
					}
				}
			}
		}

		main class="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-12" {
			@render children()
		}

		footer class="border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-500" 'Svelte Store &middot; a demo storefront'
	}
</template>
