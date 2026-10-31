import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import fallbackProducts from './fallback-products.json';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    if ((await this.prisma.product.count()) === 0) {
      const r = await this.populate();
      this.logger.log(`Seeded ${r.count} products from ${r.source}`);
    }
  }

  async reseed(): Promise<{ count: number; source: string }> {
    // Upsert fresh data, then drop stale products that no order references
    // (a plain clear() would violate order_item foreign keys).
    const r = await this.populate();
    await this.prisma.product.deleteMany({
      where: { id: { notIn: r.ids }, orderItems: { none: {} } },
    });
    return { count: r.count, source: r.source };
  }

  private async populate(): Promise<{ count: number; source: string; ids: number[] }> {
    let items: FakeStoreProduct[];
    let source = 'fakestoreapi.com';
    try {
      const res = await fetch('https://fakestoreapi.com/products', {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as FakeStoreProduct[];
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('empty or invalid response');
      }
      items = data;
    } catch (err) {
      this.logger.warn(
        `Could not fetch fakestoreapi.com (${(err as Error).message}); using fallback products`,
      );
      items = fallbackProducts as FakeStoreProduct[];
      source = 'fallback-products.json';
    }
    await this.prisma.$transaction(
      items.map((p) => {
        const data = {
          title: p.title,
          price: p.price,
          description: p.description,
          category: p.category,
          image: p.image,
          ratingRate: p.rating?.rate ?? 0,
          ratingCount: p.rating?.count ?? 0,
        };
        return this.prisma.product.upsert({
          where: { id: p.id },
          create: { id: p.id, ...data },
          update: data,
        });
      }),
    );
    return { count: items.length, source, ids: items.map((p) => p.id) };
  }
}
