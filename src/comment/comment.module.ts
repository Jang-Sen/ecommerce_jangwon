import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@root/comment/entities/comment.entity';
import { ProductModule } from '@product/product.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ProductModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
