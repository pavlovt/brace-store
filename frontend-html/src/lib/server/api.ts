import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

const base = () => (env.API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

export class ApiError extends Error {
	constructor(
		public status: number,
		public messages: string[]
	) {
		super(messages.join(', '));
	}
}

async function parse(res: Response) {
	const text = await res.text();
	try {
		return text ? JSON.parse(text) : null;
	} catch {
		return text;
	}
}

/** Raw request; throws ApiError for non-2xx responses, or a 503 SvelteKit error if the backend is unreachable. */
export async function request<T>(fetchFn: typeof fetch, path: string, init?: RequestInit): Promise<T> {
	let res: Response;
	try {
		res = await fetchFn(base() + path, {
			...init,
			headers: { Accept: 'application/json', ...(init?.headers ?? {}) }
		});
	} catch {
		error(503, 'The store backend is unreachable. Please try again shortly.');
	}
	const data = await parse(res);
	if (!res.ok) {
		const m = data && typeof data === 'object' ? (data as { message?: string | string[] }).message : undefined;
		const messages = Array.isArray(m) ? m : m ? [m] : [res.statusText || `Request failed (${res.status})`];
		throw new ApiError(res.status, messages);
	}
	return data as T;
}

/** GET helper for load functions: maps API errors to SvelteKit errors. */
export async function get<T>(fetchFn: typeof fetch, path: string): Promise<T> {
	try {
		return await request<T>(fetchFn, path);
	} catch (e) {
		if (e instanceof ApiError) {
			if (e.status === 404) error(404, 'Not found');
			error(e.status >= 500 ? 502 : e.status, e.message);
		}
		throw e;
	}
}

export function post<T>(fetchFn: typeof fetch, path: string, body: unknown): Promise<T> {
	return request<T>(fetchFn, path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
}
