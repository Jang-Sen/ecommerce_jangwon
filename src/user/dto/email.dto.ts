import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ example: 'dh789521@gmail.com' })
  email: string;
}
