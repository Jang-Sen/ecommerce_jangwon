import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iPhone 16 Pro' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '궁극의 iPhone.' })
  description: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1550000 })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mobile' })
  category: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: [
      'https://s.gravatar.com/avatar/f5eb4ce92bbb475a8d07b90174067027?s=200&r=pg&d=mm',
    ],
  })
  productImg?: string[];
}
