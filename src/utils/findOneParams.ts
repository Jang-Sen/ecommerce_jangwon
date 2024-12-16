import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @IsString()
  @ApiProperty({ example: 'e9b30b36-0995-4123-a948-8acf327f64f6' })
  id: string;
}
