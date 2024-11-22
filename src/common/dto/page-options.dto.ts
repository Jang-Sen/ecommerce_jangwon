import { Order } from '@root/common/constants/order.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Sort } from '@root/common/constants/sort.constant';

export class PageOptionsDto {
  @ApiPropertyOptional({ type: String })
  // @IsOptional()
  readonly keyword: string;

  @IsOptional()
  @IsEnum(Sort)
  @ApiPropertyOptional({
    description: '정렬 기준',
    enum: Sort,
    default: Sort.CREATED_AT,
  })
  readonly sort?: Sort = Sort.CREATED_AT;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({
    description: '정렬 순서',
    enum: Order,
    default: Order.ASC,
  })
  readonly order?: Order = Order.ASC;

  @IsOptional()
  @ApiPropertyOptional({
    description: '현재 페이지',
    minimum: 1,
    default: 1,
  })
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional({
    description: '현재 페이지에 보여지는 데이터 수',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  // @Min(1)
  // @Max(50)
  // @IsInt()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
