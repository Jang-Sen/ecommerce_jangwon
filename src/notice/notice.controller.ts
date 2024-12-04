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
  @ApiOperation({ summary: '상세(id) 조회' })
  @ApiParam({ name: 'id', description: '공지사항 ID' })
  async getNoticeById(@Param('id') id: string) {
    return await this.noticeService.getNoticeById(id);
  }

  @Post()
  @ApiOperation({ summary: '생성' })
  @ApiBody({ type: CreateNoticeDto })
  async createNotice(@Body() dto: CreateNoticeDto) {
    return await this.noticeService.createNotice(dto);
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
    type: CreateNoticeDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'Notice Files',
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
