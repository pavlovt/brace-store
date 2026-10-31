import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import type { Order } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
	const orders = await get<Order[]>(fetch, '/orders');
	return { orders: [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) };
};
