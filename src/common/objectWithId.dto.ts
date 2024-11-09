import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ObjectWithIdDto {
  @IsString()
  @ApiProperty()
  id: string;
}
