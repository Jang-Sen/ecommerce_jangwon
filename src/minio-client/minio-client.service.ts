import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { BufferedFile } from '@minio-client/interface/file.model';
import * as crypto from 'crypto';
import { Product } from '@product/entities/product.entity';
import { Notice } from '@notice/entities/notice.entity';

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

  // 파일 이름
  generateFileName(originalName: string): string {
    const temp_fileName = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_fileName)
      .digest('hex');
    const ext = originalName.substring(
      originalName.lastIndexOf('.'),
      originalName.length,
    );

    return `${hashedFileName}${ext}`;
  }

  // 공지사항 파일 업로드
  public async uploadNoticeFiles(
    notice: Notice,
    files: BufferedFile[],
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    // 기존에 있던 폴더 지우고
    if (`${categoryName}/${notice.id}`.includes(notice.id)) {
      // await this.delete(`${categoryName}/${member.id}`);
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${notice.id}/`,
      );
    }

    for (const file of files) {
      if (
        !(
          file.mimetype.includes('png') ||
          file.mimetype.includes('jpg') ||
          file.mimetype.includes('jpeg') ||
          file.mimetype.includes('pdf')
        )
      ) {
        throw new HttpException('Error Upload File!', HttpStatus.BAD_REQUEST);
      }

      const temp_fileName = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(temp_fileName)
        .digest('hex');
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': 1234,
      };

      const fileName = hashedFileName + ext;
      const fileBuffer = file.buffer;
      const filePath = `${categoryName}/${notice.id}/${fileName}`;

      await new Promise<void>((resolve, reject) => {
        this.client.putObject(
          baseBucket,
          filePath,
          fileBuffer,
          fileBuffer.length,
          metaData,
          (err) => {
            if (err) {
              console.log('Error uploading file:', err.message);
              return reject(
                new HttpException(
                  'Error Uploading File',
                  HttpStatus.BAD_REQUEST,
                ),
              );
            }
            resolve();
          },
        );
      });

      uploadedUrls.push(
        `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
      );
    }

    return uploadedUrls;
  }

  // 제품 이미지 파일 업로드하는 로직
  public async uploadProductImgs(
    product: Product,
    files: BufferedFile[],
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    // 해당되는 폴더를 지우고
    if (`${categoryName}/${product.id}`.includes(product.id)) {
      // await this.delete(`${categoryName}/${member.id}`);
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${product.id}/`,
      );
    }

    for (const file of files) {
      if (
        !(
          file.mimetype.includes('png') ||
          file.mimetype.includes('jpg') ||
          file.mimetype.includes('jpeg')
        )
      ) {
        throw new HttpException('Error Upload File.', HttpStatus.BAD_REQUEST);
      }
      const temp_fileName = Date.now().toString();
      const hashedFileName = crypto
        .createHash('md5')
        .update(temp_fileName)
        .digest('hex');
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': 1234,
      };

      const fileName = hashedFileName + ext;
      const fileBuffer = file.buffer;
      const filePath = `${categoryName}/${product.id}/${fileName}`;

      await new Promise<void>((resolve, reject) => {
        this.client.putObject(
          baseBucket,
          filePath,
          fileBuffer,
          fileBuffer.length,
          metaData,
          (err) => {
            if (err) {
              console.log('Error uploading file:', err.message);
              return reject(
                new HttpException(
                  'Error uploading file',
                  HttpStatus.BAD_REQUEST,
                ),
              );
            }
            resolve();
          },
        );
      });

      uploadedUrls.push(
        `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
      );
    }

    // console.log(
    //   `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
    // );
    return uploadedUrls;
  }

  // 프로필 이미지 파일 업로드하는 로직
  public async uploadProfileImg(
    user: User,
    file: BufferedFile,
    categoryName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<string> {
    console.log('+++++++++++++++++++file = ' + file);
    if (
      !(
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpeg')
      )
    ) {
      throw new HttpException(
        'Error uploading file format',
        HttpStatus.BAD_REQUEST,
      );
    }

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

    // 유저에 해당되는 폴더를 지우고
    if (`${categoryName}/${user.id}`.includes(user.id)) {
      // await this.delete(`${categoryName}/${member.id}`);
      await this.deleteFolderContents(
        this.baseBucket,
        `${categoryName}/${user.id}/`,
      );
    }

    await new Promise<void>((resolve, reject) => {
      this.client.putObject(
        baseBucket,
        filePath,
        fileBuffer,
        fileBuffer.length,
        metaData,
        (err) => {
          if (err) {
            console.log('Error uploading file:', err.message);
            return reject(
              new HttpException('Error uploading file', HttpStatus.BAD_REQUEST),
            );
          }
          resolve();
        },
      );
    });

    console.log(
      `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`,
    );
    return `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${filePath}`;
  }

  // 프로필 사진 업로드 전, 기존 파일 삭제 로직
  async deleteFolderContents(bucketName: string, folderPath: string) {
    const objectList = [];
    const stream = this.client.listObjects(bucketName, folderPath, true);

    for await (const obj of stream) {
      objectList.push(obj.name);
    }

    if (objectList.length > 0) {
      const deleteResult = await this.client.removeObjects(
        bucketName,
        objectList,
      );

      console.log('Delete Success: ' + deleteResult);
    }

    console.log('No Objects: ');
  }
}
