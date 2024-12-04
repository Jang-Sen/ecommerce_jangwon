import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoticeDto {
  @IsString()
  @ApiProperty({ example: '배송에 관한 공지사항' })
  title: string;

  @IsString()
  @ApiProperty({ example: '공지' })
  category: string;

  @IsString()
  @ApiProperty({
    example:
      '12/15 ~ 12/30 까지 배송물이 많이 밀려있어, 배송이 지연될 수 있음을 알립니다. 이용에 불편을 드려서 죄송합니다.',
  })
  description: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['noticeFile1.jpg', 'noticeFile2.pdf'],
  })
  noticeFiles?: string[];
}
