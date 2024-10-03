import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true })
  public name: string;

  @Column()
  public price: number;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @Column()
  public productImg: string;
}
