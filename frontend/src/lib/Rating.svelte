<script lang="ts">
	let { rate, count }: { rate: number; count: number } = $props();
	const pct = $derived(Math.max(0, Math.min(100, (rate / 5) * 100)));
</script>

<template lang="braceml">
	span class="inline-flex items-center gap-1.5 text-sm text-slate-500" title="{rate} out of 5" {
		span class="relative inline-block text-base leading-none tracking-wider text-slate-300" aria-hidden="true" {
			'★★★★★'
			span class="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-amber-500" style="width: {pct}%" '★★★★★'
		}
		span {
			'{rate.toFixed(1)}'
			span class="text-slate-400" '({count})'
		}
	}
</template>
