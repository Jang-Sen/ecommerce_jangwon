import { Injectable, NotFoundException } from '@nestjs/common';
import { MinioClientService } from '@minio-client/minio-client.service';
import { Repository } from 'typeorm';
import { Notice } from '@notice/entities/notice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from '@common/dto/page.dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageMetaDto } from '@common/dto/page-meta.dto';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
import { UpdateNoticeDto } from '@notice/dto/update-notice.dto';
import { BufferedFile } from '@minio-client/interface/file.model';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly repository: Repository<Notice>,
    private readonly minioClientService: MinioClientService,
  ) {}

  // 전체 조회
  async getAllNotice(pageOptionsDto: PageOptionsDto): Promise<PageDto<Notice>> {
    const queryBuilder = this.repository.createQueryBuilder('notice');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('notice.title LIKE :keyword', {
        keyword: `%${pageOptionsDto.keyword}%`,
      });
    }

    queryBuilder
      .orderBy('notice.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  // 상세 조회
  async getNoticeById(noticeId: string) {
    const notice = await this.repository.findOneBy({ id: noticeId });

    if (!notice) {
      throw new NotFoundException('Not Found Notice');
    }

    return notice;
  }

  // 생성
  async createNotice(createNoticeDto: CreateNoticeDto) {
    const newNotice = this.repository.create(createNoticeDto);
    await this.repository.save(newNotice);

    return newNotice;
  }

  // 삭제
  async deleteNotice(noticeId: string) {
    const deleteResponse = await this.repository.delete(noticeId);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Not Found Notice');
    }

    return deleteResponse;
  }

  // 수정
  async updateNotice(
    noticeId: string,
    dto?: UpdateNoticeDto,
    files?: BufferedFile[],
  ) {
    const notice = await this.getNoticeById(noticeId);
    const noticeUrlFiles = files?.length
      ? await this.minioClientService.uploadNoticeFiles(notice, files, 'notice')
      : [];
    const updateResult = await this.repository.update(notice.id, {
      ...dto,
      noticeFiles: noticeUrlFiles,
    });

    if (!updateResult) {
      throw new NotFoundException('Not Found Notice');
    }

    return updateResult;
  }
}
