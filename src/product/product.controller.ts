import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from '@product/product.service';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { ObjectWithIdDto } from '@root/common/dto/objectWithId.dto';
import { RoleGuard } from '@auth/guards/role.guard';
import { Role } from '@user/entities/role.enum';
import { Product } from '@product/entities/product.entity';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { BufferedFile } from '@minio-client/interface/file.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // product 전체 데이터 불러오는 api
  @Get('/all')
  @ApiOperation({ summary: '전체 조회 API' })
  async getAllProducts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    return await this.productService.getAllProducts(pageOptionsDto);
  }

  // product 상세(id) 데이터 불러오는 api
  @Get('/:id')
  @ApiOperation({ summary: '상세(id) 조회 API' })
  async getProductById(@Param() { id }: ObjectWithIdDto): Promise<Product> {
    return await this.productService.getProductById(id);
  }

  // product 신규 등록 api
  @Post('/new')
  @UseInterceptors(FilesInterceptor('imgs'))
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: '등록 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'iPhone 16 Pro',
          description: '제품 이름',
        },
        description: {
          type: 'string',
          example: '궁극의 iPhone.',
          description: '제품 설명',
        },
        price: {
          type: 'number',
          example: 1550000,
          description: '제품 가격',
        },
        category: {
          type: 'string',
          example: 'Mobile',
          description: '제품 분류',
        },
        imgs: {
          type: 'array',
          description: '제품 사진',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async createProduct(
    // @Body('name') name: string,
    // @Body('description') description: string,
    // @Body('price') price: number,
    // @Body('category') category: string,
    // @Body('productImg') productImg: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() imgs: BufferedFile[],
  ): Promise<Product> {
    return await this.productService.createProduct(createProductDto, imgs);
  }

  // product 수정 api
  @Put('/:id')
  @UseInterceptors(FilesInterceptor('imgs'))
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: '수정 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'iPhone 16 Pro',
          description: '제품 이름',
        },
        description: {
          type: 'string',
          example: '궁극의 iPhone.',
          description: '제품 설명',
        },
        price: {
          type: 'number',
          example: 1550000,
          description: '제품 가격',
        },
        category: {
          type: 'string',
          example: 'Mobile',
          description: '제품 분류',
        },
        imgs: {
          type: 'array',
          description: '제품 사진',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Param() { id }: ObjectWithIdDto,
    @Body() updateProductDto?: UpdateProductDto,
    @UploadedFiles() imgs?: BufferedFile[],
  ) {
    return await this.productService.updateProductById(
      id,
      updateProductDto,
      imgs,
    );
  }

  // id에 해당되는 product 삭제 api
  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: '삭제 API',
    description: `${Role.ADMIN}만 이용가능`,
  })
  async deleteProductById(@Param() { id }: ObjectWithIdDto) {
    return await this.productService.deleteProductById(id);
  }
}
