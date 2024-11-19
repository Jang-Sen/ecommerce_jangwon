import { PageMetaDto } from '@root/common/dto/page-meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
