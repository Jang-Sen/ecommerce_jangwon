import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NoticeService } from '@notice/notice.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from '@common/dto/page.dto';
import { Notice } from '@notice/entities/notice.entity';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
import { UpdateNoticeDto } from '@notice/dto/update-notice.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@minio-client/interface/file.model';

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/all')
  @ApiOperation({ summary: '전체 조회', description: '페이징 처리' })
  async getAllNotices(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Notice>> {
    return await this.noticeService.getAllNotice(pageOptionsDto);
  }

  @Get('/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '상세(id) 조회' })
  @ApiParam({ name: 'id', description: '공지사항 ID' })
  async getNoticeById(@Param('id') id: string) {
    return await this.noticeService.getNoticeById(id);
  }

  @Post()
  @ApiOperation({ summary: '생성' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: '배송에 관한 공지사항',
          description: '제목',
        },
        category: {
          type: 'string',
          example: '공지',
          description: '글 분류',
        },
        description: {
          type: 'string',
          example:
            '12/15 ~ 12/30 까지 배송물이 많이 밀려있어, 배송이 지연될 수 있음을 알립니다. 이용에 불편을 드려서 죄송합니다.',
          description: '상세 글',
        },
        files: {
          type: 'array',
          description: '공지사항 파일',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async createNotice(
    @Body() dto: CreateNoticeDto,
    @UploadedFiles() files: BufferedFile[],
  ) {
    return await this.noticeService.createNotice(dto, files);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '삭제' })
  @ApiParam({ name: 'id', description: '공지사항 ID' })
  async deleteNotice(@Param('id') id: string) {
    return await this.noticeService.deleteNotice(id);
  }

  @Put('/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '수정' })
  @ApiParam({ name: 'id', description: '공지사항 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: '배송에 관한 공지사항',
          description: '제목',
        },
        category: {
          type: 'string',
          example: '공지',
          description: '글 분류',
        },
        description: {
          type: 'string',
          example:
            '12/15 ~ 12/30 까지 배송물이 많이 밀려있어, 배송이 지연될 수 있음을 알립니다. 이용에 불편을 드려서 죄송합니다.',
          description: '상세 글',
        },
        files: {
          type: 'array',
          description: '공지사항 파일',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateNotice(
    @Param('id') id: string,
    @Body() dto?: UpdateNoticeDto,
    @UploadedFiles() files?: BufferedFile[],
  ) {
    return await this.noticeService.updateNotice(id, dto, files);
  }
}
