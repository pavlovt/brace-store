import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [PrismaModule, ProductsModule, OrdersModule, SeedModule],
})
export class AppModule {}
