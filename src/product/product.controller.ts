import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // product 전체 데이터 불러오는 api
  @Get('/all')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  // product 상세(id) 데이터 불러오는 api
  @Get('/:productId')
  async getProductById(@Param('productId') productId: string) {
    return await this.productService.getProductById(productId);
  }

  // product 신규 등록 api
  @Post('/new')
  async createProduct(
    // @Body('name') name: string,
    // @Body('description') description: string,
    // @Body('price') price: number,
    // @Body('category') category: string,
    // @Body('productImg') productImg: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productService.createProduct(createProductDto);
  }

  // product 수정 api
  @Put('/:productId')
  @ApiBody({ type: CreateProductDto })
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProductById(
      productId,
      updateProductDto,
    );
  }

  // id에 해당되는 product 삭제 api
  @Delete('/:productId')
  async deleteProductById(@Param('productId') productId: string) {
    return await this.productService.deleteProductById(productId);
  }
}
