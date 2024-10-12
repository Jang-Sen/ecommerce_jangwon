import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'dh7895@naver.com' })
  email: string;

  @ApiProperty({ example: '1234' })
  password: string;
}
