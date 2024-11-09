import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProductService } from '@product/product.service';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { ObjectWithIdDto } from '@root/common/objectWithId.dto';
import { RoleGuard } from '@auth/guards/role.guard';
import { Role } from '@user/entities/role.enum';

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
  @Get('/:id')
  async getProductById(@Param() { id }: ObjectWithIdDto) {
    return await this.productService.getProductById(id);
  }

  // product 신규 등록 api
  @Post('/new')
  @UseGuards(RoleGuard(Role.ADMIN))
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
  @Put('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBody({ type: CreateProductDto })
  async updateProduct(
    @Param() { id }: ObjectWithIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProductById(id, updateProductDto);
  }

  // id에 해당되는 product 삭제 api
  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async deleteProductById(@Param() { id }: ObjectWithIdDto) {
    return await this.productService.deleteProductById(id);
  }
}
