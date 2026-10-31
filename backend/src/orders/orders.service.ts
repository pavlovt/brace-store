import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { ProductJson, toProductJson } from '../products/product.mapper';
import { CreateOrderDto } from './create-order.dto';

const include = {
  items: { include: { product: true }, orderBy: { id: 'asc' } },
} satisfies Prisma.OrderInclude;

type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof include }>;

export interface OrderJson {
  id: number;
  createdAt: Date;
  total: number;
  customerName: string;
  customerEmail: string;
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    product: ProductJson;
  }[];
}

function toOrderJson(o: OrderWithItems): OrderJson {
  return {
    id: o.id,
    createdAt: o.createdAt,
    total: o.total,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      product: toProductJson(i.product),
    })),
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto): Promise<OrderJson> {
    const ids = [...new Set(dto.items.map((i) => i.productId))];
    const found = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
    const byId = new Map(found.map((p) => [p.id, p]));
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `Unknown productId: ${missing.join(', ')}`,
      );
    }

    const lines = dto.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: byId.get(i.productId)!.price,
    }));
    const total =
      Math.round(
        lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0) * 100,
      ) / 100;

    const created = await this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        total,
        items: { create: lines },
      },
      include,
    });
    return toOrderJson(created);
  }

  async findAll(): Promise<OrderJson[]> {
    const rows = await this.prisma.order.findMany({
      include,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    return rows.map(toOrderJson);
  }

  async findOne(id: number): Promise<OrderJson> {
    const o = await this.prisma.order.findUnique({ where: { id }, include });
    if (!o) throw new NotFoundException(`Order ${id} not found`);
    return toOrderJson(o);
  }
}
