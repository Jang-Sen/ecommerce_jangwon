import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '@root/comment/comment.service';
import { CreateCommentDto } from '@root/comment/dto/create-comment.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { EmailDto } from '@user/dto/email.dto';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { FindOneParams } from '@root/utils/findOneParams';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:id')
  @UseGuards(AccessTokenGuard)
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: CreateCommentDto })
  async createComment(
    @Req() req: RequestWithUserInterface,
    @Param('id') { id }: FindOneParams,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      req.user,
      id,
      createCommentDto,
    );
  }

  // 제품 ID를 필터해서 갖고오기
  @Get('/:id')
  async findCommentByProductId(@Param('id') { id }: FindOneParams) {
    return await this.commentService.findCommentsByProductId(id);
  }

  @Delete()
  async deleteComment(@Param() emailDto: EmailDto) {
    return await this.commentService.deleteComment(emailDto.email);
  }

  // @Put()
  // async updateComment(@Param())
}
