import { Column, Entity } from 'typeorm';
import { Base } from '@common/entities/base.entity';

@Entity()
export class Product extends Base {
  @Column({ unique: true })
  public name: string;

  @Column()
  public price: number;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  public productImg?: string[];
}
