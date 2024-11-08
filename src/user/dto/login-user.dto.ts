import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'dh789521@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456a!' })
  password: string;
}
