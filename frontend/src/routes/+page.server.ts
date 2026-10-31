import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import type { Product } from '$lib/types';

const SORTS = ['price_asc', 'price_desc', 'rating'];

export const load: PageServerLoad = async ({ fetch, url }) => {
	const category = url.searchParams.get('category')?.trim() ?? '';
	const search = url.searchParams.get('search')?.trim() ?? '';
	let sort = url.searchParams.get('sort') ?? '';
	if (!SORTS.includes(sort)) sort = '';

	const qs = new URLSearchParams();
	if (category) qs.set('category', category);
	if (search) qs.set('search', search);
	if (sort) qs.set('sort', sort);

	const [products, categories] = await Promise.all([
		get<Product[]>(fetch, `/products${qs.size ? `?${qs}` : ''}`),
		get<string[]>(fetch, '/categories')
	]);

	return { products, categories, category, search, sort };
};
