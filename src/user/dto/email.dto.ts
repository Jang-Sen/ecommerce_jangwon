import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ example: 'dh7895210@naver.com' })
  email: string;
}
