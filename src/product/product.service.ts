import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/entities/product.entity';
import { PageDto } from '@root/common/dto/page.dto';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    // return await this.productRepository.find();
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy('product.createdAt', 'ASC')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async deleteProductById(productId: string) {
    // const product = await this.getProductById(productId);

    const deleteResponse = await this.productRepository.delete(productId);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Product Not Found');
    }

    return deleteResponse;
  }

  async updateProductById(id: string, dto: UpdateProductDto) {
    const updateProduct = await this.productRepository.update(id, dto);

    if (!updateProduct) {
      throw new NotFoundException('Product Not Found');
    }

    return updateProduct;
  }
}
