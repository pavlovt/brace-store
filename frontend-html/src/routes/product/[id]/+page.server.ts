import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { get } from '$lib/server/api';
import type { Product } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	if (!/^\d+$/.test(params.id)) error(404, 'Product not found');
	const product = await get<Product>(fetch, `/products/${params.id}`);
	return { product };
};
