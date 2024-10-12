import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 16 Pro' })
  name: string;

  @ApiProperty({ example: '궁극의 iPhone.' })
  description: string;

  @ApiProperty({ example: 1550000 })
  price: number;

  @ApiProperty({ example: 'Mobile' })
  category: string;

  @ApiProperty({
    example:
      'https://s.gravatar.com/avatar/f5eb4ce92bbb475a8d07b90174067027?s=200&r=pg&d=mm',
  })
  productImg: string;
}
