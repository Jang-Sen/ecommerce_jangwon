import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailValificationDto {
  @IsEmail()
  @ApiProperty({ example: 'dh789521@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '000000' })
  code: string;
}
