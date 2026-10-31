<script lang="ts">
	import { enhance } from '$app/forms';
	import { cart } from '$lib/cart.svelte';
	import { formatPrice } from '$lib/format';

	let { form } = $props();
	let submitting = $state(false);

	const payload = $derived(JSON.stringify(cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))));
	const input = 'w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500';
	const qtyBtn = 'h-9 w-8 cursor-pointer bg-slate-50 hover:bg-slate-200';
</script>

<template lang="braceml">
	svelte:head > title 'Cart | Svelte Store'

	h1 class="mb-4 text-2xl font-bold sm:text-3xl" 'Your cart'

	if !cart.ready {
		p class="text-slate-500" 'Loading your cart...'
	} else if cart.items.length === 0 {
		div class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center" {
			h2 class="mb-1 text-xl font-bold" 'Your cart is empty'
			p class="mb-4 text-slate-500" 'Browse the shop and add something you like.'
			a class="inline-flex rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-700" href=/ 'Continue shopping'
		}
	} else {
		div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" {
			section class="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Cart items" {
				each cart.items as item (item.productId) {
					div class="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[72px_minmax(0,1fr)_auto]" {
						a href="/product/{item.productId}" > img class="size-14 rounded-lg border border-slate-200 bg-white object-contain p-1 sm:size-18" src={item.image} alt="" loading=lazy
						div {
							a class="line-clamp-2 font-semibold hover:text-brand-700" href="/product/{item.productId}" '{item.title}'
							span class="text-slate-500" '{formatPrice(item.price)} each'
							div class="mt-1.5 flex flex-wrap items-center gap-4" {
								div class="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white" role=group aria-label="Quantity for {item.title}" {
									button class={qtyBtn} type=button aria-label="Decrease quantity" onclick={() => cart.setQuantity(item.productId, item.quantity - 1)} '&minus;'
									output class="min-w-9 text-center font-semibold" '{item.quantity}'
									button class={qtyBtn} type=button aria-label="Increase quantity" onclick={() => cart.setQuantity(item.productId, item.quantity + 1)} '+'
								}
								button class="cursor-pointer text-red-700 underline" type=button onclick={() => cart.remove(item.productId)} 'Remove'
							}
						}
						div class="col-start-2 font-bold sm:col-start-auto sm:text-right" '{formatPrice(item.price * item.quantity)}'
					}
				}
			}

			aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20" {
				h2 class="mb-2 text-xl font-bold" 'Checkout'
				div class="flex justify-between py-1" {
					span 'Items'
					span '{cart.count}'
				}
				div class="mt-2 flex justify-between border-t border-slate-200 pt-3 text-xl font-extrabold" {
					span 'Subtotal'
					span '{formatPrice(cart.subtotal)}'
				}

				form(
					class="mt-4"
					method=POST
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update({ reset: false });
							submitting = false;
						};
					}}
				) {
					if form?.errors?.length {
						div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800" role=alert {
							if form.errors.length === 1 {
								'{form.errors[0]}'
							} else {
								ul class="list-disc pl-5" {
									each form.errors as msg (msg) {
										li '{msg}'
									}
								}
							}
						}
					}
					input type=hidden name=items value={payload}
					div class="mb-4 flex flex-col gap-1" {
						label class="text-sm font-semibold" for=customerName 'Full name'
						input class={input} id=customerName name=customerName type=text autocomplete=name required value={form?.customerName ?? ''}
					}
					div class="mb-4 flex flex-col gap-1" {
						label class="text-sm font-semibold" for=customerEmail 'Email'
						input class={input} id=customerEmail name=customerEmail type=email autocomplete=email required value={form?.customerEmail ?? ''}
					}
					button class="w-full cursor-pointer rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60" type=submit disabled={submitting} "{submitting ? 'Placing order...' : `Place order · ${formatPrice(cart.subtotal)}`}"
				}
			}
		}
	}
</template>
