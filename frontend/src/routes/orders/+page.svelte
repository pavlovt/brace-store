<script lang="ts">
	import { formatDate, formatPrice } from '$lib/format';
	let { data } = $props();
	const th = 'px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap';
</script>

<template lang="braceml">
	svelte:head > title 'Orders | Svelte Store'

	h1 class="mb-4 text-2xl font-bold sm:text-3xl" 'Your orders'

	if data.orders.length === 0 {
		div class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center" {
			h2 class="mb-1 text-xl font-bold" 'No orders yet'
			p class="mb-4 text-slate-500" 'Orders you place will show up here.'
			a class="inline-flex rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-700" href=/ 'Start shopping'
		}
	} else {
		div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm" {
			table class="w-full text-left" {
				thead class="bg-slate-50" > tr {
					th class={th} 'Order'
					th class={th} 'Date'
					th class={th} 'Customer'
					th class="{th} text-right" 'Items'
					th class="{th} text-right" 'Total'
					th class={th}
				}
				tbody class="divide-y divide-slate-200 whitespace-nowrap" {
					each data.orders as o (o.id) {
						tr {
							td class="px-4 py-3" > a class="hover:text-brand-700" href="/orders/{o.id}" > strong '#{o.id}'
							td class="px-4 py-3" '{formatDate(o.createdAt)}'
							td class="px-4 py-3" '{o.customerName}'
							td class="px-4 py-3 text-right" '{o.items.reduce((n, i) => n + i.quantity, 0)}'
							td class="px-4 py-3 text-right" '{formatPrice(o.total)}'
							td class="px-4 py-3" > a class="text-brand-700 hover:underline" href="/orders/{o.id}" 'View'
						}
					}
				}
			}
		}
	}
</template>
