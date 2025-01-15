import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '@profile/entities/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: '생년월일',
    example: null,
    default: null,
  })
  birth?: Date;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    description: '성별',
    enum: Gender,
    enumName: 'Gender',
    example: Gender.DEFAULT,
    default: Gender.DEFAULT,
  })
  gender: Gender;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '한 줄 소개',
    default: null,
  })
  introduce?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'SNS 링크',
    default: null,
  })
  snsLink?: string;
}
