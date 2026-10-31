import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { ProductJson, toProductJson } from './product.mapper';
import { SeedService } from '../seed/seed.service';

export type ProductSort = 'price_asc' | 'price_desc' | 'rating';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seed: SeedService,
  ) {}

  async findAll(
    category?: string,
    search?: string,
    sort?: ProductSort,
  ): Promise<ProductJson[]> {
    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category;
    // On SQLite, `contains` compiles to LIKE, which is case-insensitive for ASCII.
    if (search) where.title = { contains: search };

    let orderBy: Prisma.ProductOrderByWithRelationInput[];
    switch (sort) {
      case 'price_asc':
        orderBy = [{ price: 'asc' }];
        break;
      case 'price_desc':
        orderBy = [{ price: 'desc' }];
        break;
      case 'rating':
        orderBy = [{ ratingRate: 'desc' }, { ratingCount: 'desc' }];
        break;
      default:
        orderBy = [{ id: 'asc' }];
    }
    const rows = await this.prisma.product.findMany({ where, orderBy });
    return rows.map(toProductJson);
  }

  async findOne(id: number): Promise<ProductJson> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Product ${id} not found`);
    return toProductJson(p);
  }

  async categories(): Promise<string[]> {
    const rows = await this.prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category);
  }

  async reseed(): Promise<{ count: number; source: string }> {
    return this.seed.reseed();
  }
}
