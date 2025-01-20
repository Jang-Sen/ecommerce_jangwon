import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@root/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { ProductService } from '@product/product.service';
import { UserService } from '@user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  // // 등록
  // async createComment(
  //   user: User,
  //   productId: string,
  //   createCommentDto: CreateCommentDto,
  // ) {
  //   const product = await this.productService.getProductById(productId);
  //   const comment = this.repository.create({
  //     ...createCommentDto,
  //     user,
  //     product,
  //   });
  //   await this.repository.save(comment);
  //
  //   return comment;
  // }
  //
  // // 조회
  // async findCommentsByProductId(productId: string): Promise<Comment[]> {
  //   const product = await this.productService.getProductById(productId);
  //
  //   const comments = await this.repository.find({
  //     where: {
  //       product: {
  //         id: product.id,
  //       },
  //     },
  //     relations: ['user', 'product'],
  //   });
  //   return comments;
  // }
  //
  // // 삭제
  // async deleteComment(user: User, id: string): Promise<string> {
  //   const comment = await this.repository.findOne({
  //     where: { id },
  //     relations: ['user'],
  //   });
  //
  //   if (!comment) {
  //     throw new NotFoundException('Not Found Comment');
  //   }
  //
  //   // 요청 유저가 작성자인지 확인
  //   if (comment.user.id !== user.id) {
  //     throw new ForbiddenException('Not allowed to delete this comment');
  //   }
  //
  //   await this.repository.remove(comment);
  //
  //   return 'Delete';
  // }
  //
  // // 수정
  // async updateComment(
  //   user: User,
  //   id: string,
  //   updateCommentDto: UpdateCommentDto,
  // ): Promise<string> {
  //   // 댓글 존재 확인
  //   const comment = await this.repository.findOne({
  //     where: { id },
  //     relations: ['user'], // 작성자 정보 조회
  //   });
  //
  //   if (!comment) {
  //     throw new NotFoundException('Not Found Comment');
  //   }
  //
  //   // 요청 유저가 작성자인지 확인
  //   if (comment.user.id !== user.id) {
  //     throw new ForbiddenException('Not allowed to update this comment');
  //   }
  //
  //   // 수정 데이터를 기존 데이터에 병합
  //   Object.assign(comment, updateCommentDto);
  //
  //   // 저장
  //   await this.repository.save(comment);
  //   // const result = await this.repository.update(id, updateCommentDto);
  //   //
  //   // if (!result.affected) {
  //   //   throw new NotFoundException('Not Found Comment');
  //   // }
  //
  //   return 'Update';
  // }
}
