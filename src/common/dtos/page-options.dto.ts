import { Order } from '@root/common/constants/order.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  readonly order?: Order = Order.ASC;

  @IsOptional()
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  // @Min(1)
  // @Max(50)
  // @IsInt()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
