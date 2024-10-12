import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    return await this.productRepository.find();
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
