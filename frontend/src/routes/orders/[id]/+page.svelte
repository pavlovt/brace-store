<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '$lib/cart.svelte';
	import { formatDate, formatPrice } from '$lib/format';

	let { data } = $props();
	const o = $derived(data.order);
	const th = 'px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap';

	onMount(() => {
		if (data.placed) {
			cart.init();
			cart.clear();
		}
	});
</script>

<template lang="braceml">
	svelte:head > title 'Order #{o.id} | Svelte Store'

	p class="mb-4 text-sm text-slate-500" {
		a class="hover:underline" href=/orders 'Orders'
		' / #{o.id}'
	}

	if data.placed {
		div class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800" role=status {
			strong 'Thank you for your order!'
			' A confirmation has been recorded for {o.customerEmail}.'
		}
	}

	h1 class="mb-4 text-2xl font-bold sm:text-3xl" 'Order #{o.id}'

	dl class="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4" {
		each [['Placed', formatDate(o.createdAt)], ['Customer', o.customerName], ['Email', o.customerEmail], ['Total', formatPrice(o.total)]] as [label, value] (label) {
			div {
				dt class="text-xs tracking-wider text-slate-500 uppercase" '{label}'
				dd class="mt-0.5 font-semibold break-words" '{value}'
			}
		}
	}

	div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm" {
		table class="w-full" {
			thead class="bg-slate-50" > tr {
				th class="{th} text-left" 'Product'
				th class="{th} text-right" 'Unit price'
				th class="{th} text-right" 'Qty'
				th class="{th} text-right" 'Subtotal'
			}
			tbody class="divide-y divide-slate-200" {
				each o.items as item (item.id) {
					tr {
						td class="px-4 py-3" > a class="flex min-w-56 items-center gap-3 hover:text-brand-700" href="/product/{item.product.id}" {
							img class="size-11 bg-white object-contain" src={item.product.image} alt="" loading=lazy
							span '{item.product.title}'
						}
						td class="px-4 py-3 text-right whitespace-nowrap" '{formatPrice(item.unitPrice)}'
						td class="px-4 py-3 text-right" '{item.quantity}'
						td class="px-4 py-3 text-right whitespace-nowrap" '{formatPrice(item.unitPrice * item.quantity)}'
					}
				}
			}
			tfoot class="border-t border-slate-200" > tr {
				td colspan="3" class="px-4 py-3 text-right font-bold" 'Total'
				td class="px-4 py-3 text-right font-bold whitespace-nowrap" '{formatPrice(o.total)}'
			}
		}
	}

	p class="mt-6" > a class="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50" href=/ 'Continue shopping'
</template>
