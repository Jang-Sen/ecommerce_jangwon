import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@minio-client/interface/file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket: string;

  public get client(): MinioClient {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('MinioClientService');
    this.baseBucket = this.configService.get('MINIO_BUCKET');
  }

  // 프로필 이미지 파일 업로드하는 로직
  public async uploadProfileImg(
    user: User,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string> {
    console.log('+++++++++++++++++++file = ' + file);
    // if (!(file.mimetype.includes('jpg') || file.mimetype.includes('png'))) {
    //   throw new HttpException(
    //     'Error uploading file format',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileBuffer = file.buffer;
    const filePath = `${categoryName}/${user.id}/${filename}`;
    // 카테고리를 포함한 파일 경로 구성
    // 파일 크기를 명시적으로 전달하고, 메타데이터를 올바른 위치에 추가

    this.client.putObject(
      baseBucket,
      filePath,
      fileBuffer,
      fileBuffer.length,
      metaData,
      function (err) {
        if (err) {
          throw new BadRequestException('Error Upload Error: ' + err.message);
        }
      },
    );

    console.log(
      `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
  }
}
