import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @MinLength(7)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/) //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  @ApiProperty({ example: '123456a!' })
  password: string; // 신규 패스워드
}
