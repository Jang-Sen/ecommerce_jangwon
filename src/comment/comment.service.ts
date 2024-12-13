import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@root/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '@root/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@root/comment/dto/update-comment.dto';
import { User } from '@user/entities/user.entity';
import { ProductService } from '@product/product.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    private readonly productRepository: ProductService,
  ) {}

  // 등록
  async createComment(
    user: User,
    productId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const product = await this.productRepository.getProductById(productId);
    const comment = this.repository.create({
      ...createCommentDto,
      user,
      product,
    });
    await this.repository.save(comment);

    return comment;
  }

  // 조회
  async findCommentsByProductId(productId: string) {
    const product = await this.productRepository.getProductById(productId);

    return await this.repository.findBy({ product });
  }

  // 삭제
  async deleteComment(id: string): Promise<string> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Not Found Comment');
    }

    return 'Delete';
  }

  // 수정
  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<string> {
    const result = await this.repository.update(id, updateCommentDto);

    if (!result.affected) {
      throw new NotFoundException('Not Found Comment');
    }

    return 'Update';
  }
}
