import { Query, Resolver } from '@nestjs/graphql';
import { Product } from '@product/entities/product.entity';
import { ProductService } from '@product/product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  // 불러오기
  @Query(() => [Product])
  //   () => PageOptionsDto, {
  //   // name: 'getAllProducts',
  //   // description: '전체 상품 조회',
  // }
  async getTotalProducts() // @Args('page', { type: () => Number, nullable: true }) page: number = 1,
  // @Args('limit', { type: () => Number, nullable: true }) limit: number = 10,
  : Promise<Product[]> {
    return await this.productService.getTotalProducts();
    // return await this.productService.getAllProducts();
  }

  // @Mutation(() => Product)
  // async createProduct(
  //   @Args('createProductDto') createProductDto: CreateProductDto,
  // ) {
  //   return await this.productService.createProduct(createProductDto);
  // }
}
