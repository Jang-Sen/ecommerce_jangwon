import { Controller } from '@nestjs/common';
import { CommentService } from '@root/comment/comment.service';
import { ApiTags } from '@nestjs/swagger';
import { Comment } from '@root/comment/entities/comment.entity';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // @Post('/:id')
  // @UseGuards(AccessTokenGuard)
  // @ApiParam({
  //   name: 'id',
  //   description: 'Product ID',
  // })
  // @ApiBody({ type: CreateCommentDto })
  // @ApiOperation({ summary: '등록' })
  // async createComment(
  //   @Req() req: RequestWithUserInterface,
  //   @Param('id') { id }: FindOneParams,
  //   @Body() createCommentDto: CreateCommentDto,
  // ) {
  //   return await this.commentService.createComment(
  //     req.user,
  //     id,
  //     createCommentDto,
  //   );
  // }
  //
  // // 제품 ID를 필터해서 갖고오기
  // @Get('/:id')
  // @ApiParam({
  //   name: 'id',
  //   description: 'Product ID',
  // })
  // @ApiOperation({ summary: '조회', description: '제품 ID를 필터해서 갖고오기' })
  // async findCommentByProductId(@Param('id') id: string): Promise<Comment[]> {
  //   return await this.commentService.findCommentsByProductId(id);
  // }
  //
  // @Delete('/:id')
  // @UseGuards(AccessTokenGuard)
  // @ApiParam({
  //   name: 'id',
  //   description: 'Comment ID',
  // })
  // @ApiOperation({ summary: '삭제' })
  // async deleteComment(
  //   @Req() req: RequestWithUserInterface,
  //   @Param('id') id: string,
  // ) {
  //   return await this.commentService.deleteComment(req.user, id);
  // }
  //
  // @Put('/:id')
  // @UseGuards(AccessTokenGuard)
  // @ApiParam({
  //   name: 'id',
  //   description: 'Comment ID',
  // })
  // @ApiOperation({ summary: '수정' })
  // async updateComment(
  //   @Req() req: RequestWithUserInterface,
  //   @Param('id') id: string,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ): Promise<string> {
  //   return await this.commentService.updateComment(
  //     req.user,
  //     id,
  //     updateCommentDto,
  //   );
  // }
}
