import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '오장원' })
  username: string;

  @ApiProperty({ example: 'dh7895@naver.com' })
  email: string;

  @ApiProperty({ example: '1234' })
  password: string;

  @ApiProperty({ example: 1012345678 })
  phone: number;
}
