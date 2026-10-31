const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (n: number) => usd.format(Number(n) || 0);

export const formatDate = (iso: string) => {
	const d = new Date(iso);
	return isNaN(d.getTime())
		? iso
		: d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
};
