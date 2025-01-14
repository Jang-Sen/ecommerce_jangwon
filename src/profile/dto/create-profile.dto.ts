import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '@profile/entities/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: '생년월일',
  })
  birth?: Date;

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({
    description: '성별',
    enum: Gender,
    enumName: 'Gender',
    example: Gender.DEFAULT,
  })
  gender: Gender;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '한 줄 소개',
  })
  introduce?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'SNS 링크',
  })
  snsLink?: string;
}
