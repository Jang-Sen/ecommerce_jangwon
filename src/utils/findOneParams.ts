import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @IsString()
  @ApiProperty()
  id: string;
}
