import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { get } from '$lib/server/api';
import type { Order } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	if (!/^\d+$/.test(params.id)) error(404, 'Order not found');
	const order = await get<Order>(fetch, `/orders/${params.id}`);
	return { order, placed: url.searchParams.get('placed') === '1' };
};
