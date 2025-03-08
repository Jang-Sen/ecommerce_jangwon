import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/entities/product.entity';
import { PageDto } from '@root/common/dto/page.dto';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';
import { MinioClientService } from '@minio-client/minio-client.service';
import { BufferedFile } from '@minio-client/interface/file.model';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly minioClientService: MinioClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // @Inject('REDIS_CLIENT') private redisClient: RedisClientType,
  ) {}

  async getTotalProducts(): Promise<any> {
    const redisData = await this.cacheManager.get('products');
    const products = await this.productRepository.find();

    if (redisData) {
      console.log('Redis Data');
      return redisData;
    }
    console.log('RDB Data');
    await this.cacheManager.set('products', products);

    return products;
  }

  async getAllProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<any>> {
    // return await this.productRepository.find();
    const cacheKey: any = `products:${JSON.stringify(pageOptionsDto)}`;

    const cacheData = await this.cacheManager.get<PageDto<Product>>(cacheKey);

    const keys = await this.cacheManager.get('products:*');

    console.log(keys);

    // console.log('@@@@@@@@@@@', cacheData);

    if (cacheData) {
      return cacheData;
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere(
        'product.name LIKE :keyword OR product.category LIKE :keyword',
        { keyword: `%${pageOptionsDto.keyword}%` },
      );
    }

    // if () {
    //   queryBuilder.orderBy('product.')
    // }

    queryBuilder
      // .leftJoinAndSelect('product.comments', 'comment')
      .orderBy(`product.${pageOptionsDto.sort}`, pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    // console.log('!!!!!!!!!!', entities);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    const result = new PageDto(entities, pageMetaDto);

    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imgs: BufferedFile[],
  ) {
    const newProduct = this.productRepository.create(createProductDto);

    const savedProduct = await this.productRepository.save(newProduct);

    if (imgs?.length) {
      savedProduct.productImg = await this.minioClientService.uploadProductImgs(
        savedProduct,
        imgs,
        'product',
      );
    }

    await this.productRepository.save(savedProduct);

    // const keys = await this.getMatchingKeys('products:*');

    await this.cacheManager.del('products:*');

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

  async updateProductById(
    productId: string,
    dto?: UpdateProductDto,
    imgs?: BufferedFile[],
  ) {
    const product = await this.getProductById(productId);
    const newProductUrlImgs = imgs?.length
      ? await this.minioClientService.uploadProductImgs(
          product,
          imgs,
          'product',
        )
      : [];

    const updateProduct = await this.productRepository.update(product.id, {
      ...dto,
      productImg: newProductUrlImgs,
    });

    await this.cacheManager.del('products');

    if (!updateProduct) {
      throw new NotFoundException('Product Not Found');
    }

    return updateProduct;
  }

  // async getMatchingKeys(pattern: string): Promise<string[]> {
  //   const keys: string[] = [];
  //   let cursor = 0;
  //
  //   do {
  //     const reply = await this.redisClient.scan(cursor, {
  //       MATCH: pattern,
  //       COUNT: 100,
  //     });
  //     cursor = reply.cursor;
  //     keys.push(...reply.keys);
  //   } while (cursor !== 0);
  //
  //   return keys;
  // }
}
