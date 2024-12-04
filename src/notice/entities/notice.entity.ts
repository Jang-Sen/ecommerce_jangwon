import { Column, Entity } from 'typeorm';
import { Base } from '@common/entities/base.entity';

@Entity()
export class Notice extends Base {
  @Column()
  public title: string;

  @Column()
  public category: string;

  @Column()
  public description: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  public noticeFiles?: string[];
}
