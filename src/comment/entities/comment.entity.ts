import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { User } from '@user/entities/user.entity';
import { Product } from '@product/entities/product.entity';

@Entity()
export class Comment extends Base {
  @ManyToOne(() => User, (user: User) => user.comments)
  public user: User;

  @ManyToOne(() => Product, (product: Product) => product.comments)
  public product: Product;

  @Column()
  public contents: string;
}
