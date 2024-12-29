import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovieUrlDto {
  @IsString()
  @ApiProperty({ description: '영화 리스트', example: 'now_playing' })
  resource: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '영화 개봉 나라',
    example: 'en-US',
    default: 'en-US',
  })
  language: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: '영화 순위 공개 페이지',
    example: 1,
    default: 1,
  })
  page: number;
}
