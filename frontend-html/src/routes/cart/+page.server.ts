import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ApiError, post } from '$lib/server/api';
import type { Order } from '$lib/types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const customerName = String(form.get('customerName') ?? '').trim();
		const customerEmail = String(form.get('customerEmail') ?? '').trim();

		let items: { productId: number; quantity: number }[] = [];
		try {
			const parsed = JSON.parse(String(form.get('items') ?? '[]'));
			if (Array.isArray(parsed)) {
				items = parsed
					.map((i) => ({ productId: Number(i.productId), quantity: Number(i.quantity) }))
					.filter((i) => Number.isInteger(i.productId) && Number.isInteger(i.quantity) && i.quantity > 0);
			}
		} catch {
			/* fall through to empty-cart error */
		}

		const values = { customerName, customerEmail };
		if (!items.length) return fail(400, { ...values, errors: ['Your cart is empty.'] });

		let order: Order;
		try {
			order = await post<Order>(fetch, '/orders', { customerName, customerEmail, items });
		} catch (e) {
			if (e instanceof ApiError) {
				return fail(e.status >= 500 ? 502 : e.status, { ...values, errors: e.messages });
			}
			throw e;
		}
		redirect(303, `/orders/${order.id}?placed=1`);
	}
};
