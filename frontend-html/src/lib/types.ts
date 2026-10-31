export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: { rate: number; count: number };
}

export interface OrderItem {
	id: number;
	quantity: number;
	unitPrice: number;
	product: Product;
}

export interface Order {
	id: number;
	createdAt: string;
	total: number;
	customerName: string;
	customerEmail: string;
	items: OrderItem[];
}

export interface CartItem {
	productId: number;
	title: string;
	price: number;
	image: string;
	quantity: number;
}
