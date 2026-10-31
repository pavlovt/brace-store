import type { CartItem, Product } from './types';

const KEY = 'svelte-store-cart';

function load(): CartItem[] {
	try {
		if (typeof localStorage === 'undefined') return [];
		const raw = localStorage.getItem(KEY);
		const data = raw ? JSON.parse(raw) : [];
		return Array.isArray(data) ? data.filter((i) => i && typeof i.productId === 'number' && i.quantity > 0) : [];
	} catch {
		return [];
	}
}

class Cart {
	items = $state<CartItem[]>([]);
	ready = $state(false);

	count = $derived(this.items.reduce((n, i) => n + i.quantity, 0));
	subtotal = $derived(this.items.reduce((s, i) => s + i.price * i.quantity, 0));

	/** Call once from the browser (root layout onMount). */
	init() {
		this.items = load();
		this.ready = true;
	}

	private save() {
		try {
			localStorage.setItem(KEY, JSON.stringify($state.snapshot(this.items)));
		} catch {
			/* storage unavailable */
		}
	}

	add(p: Pick<Product, 'id' | 'title' | 'price' | 'image'>, quantity = 1) {
		const existing = this.items.find((i) => i.productId === p.id);
		if (existing) existing.quantity += quantity;
		else this.items.push({ productId: p.id, title: p.title, price: p.price, image: p.image, quantity });
		this.save();
	}

	setQuantity(productId: number, quantity: number) {
		if (quantity <= 0) return this.remove(productId);
		const item = this.items.find((i) => i.productId === productId);
		if (item) item.quantity = Math.min(99, Math.floor(quantity));
		this.save();
	}

	remove(productId: number) {
		this.items = this.items.filter((i) => i.productId !== productId);
		this.save();
	}

	clear() {
		this.items = [];
		this.save();
	}
}

export const cart = new Cart();
