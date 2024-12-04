import { Module } from '@nestjs/common';
import { NoticeController } from '@notice/notice.controller';
import { NoticeService } from '@notice/notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from '@notice/entities/notice.entity';
import { MinioClientModule } from '@minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), MinioClientModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
