import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '@product/product.controller';
import { ProductService } from '@product/product.service';
import { Product } from '@product/entities/product.entity';
import { MinioClientModule } from '@minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), MinioClientModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
