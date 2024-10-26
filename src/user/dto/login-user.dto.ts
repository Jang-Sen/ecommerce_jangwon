import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'dh7895210@naver.com' })
  email: string;

  @ApiProperty({ example: '123456a!' })
  password: string;
}
