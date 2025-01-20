import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MovieUrlDto {
  @IsString()
  @Field()
  @ApiProperty({ description: '영화 리스트', example: 'now_playing' })
  resource: string;

  @IsString()
  @IsOptional()
  @Field()
  @ApiPropertyOptional({
    description: '영화 개봉 나라',
    example: 'en-US',
    default: 'en-US',
  })
  language: string;

  @IsNumber()
  @IsOptional()
  @Field()
  @ApiPropertyOptional({
    description: '영화 순위 공개 페이지',
    example: 1,
    default: 1,
  })
  page: number;
}
