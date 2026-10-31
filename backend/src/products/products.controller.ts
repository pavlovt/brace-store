import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService, ProductSort } from './products.service';

const SORTS = ['price_asc', 'price_desc', 'rating'];

@Controller()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get('products')
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.products.findAll(
      category,
      search,
      SORTS.includes(sort ?? '') ? (sort as ProductSort) : undefined,
    );
  }

  @Post('products/reseed')
  reseed() {
    return this.products.reseed();
  }

  @Get('products/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.products.findOne(id);
  }

  @Get('categories')
  categories() {
    return this.products.categories();
  }
}
