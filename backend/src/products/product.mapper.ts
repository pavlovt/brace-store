import type { Product } from '../generated/prisma/client';

export interface ProductJson {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export function toProductJson(p: Product): ProductJson {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.image,
    rating: { rate: p.ratingRate, count: p.ratingCount },
  };
}
