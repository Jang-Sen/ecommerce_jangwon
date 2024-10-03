import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

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
}
