import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { User } from '@user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Comment extends Base {
  @ManyToOne(() => User, (user: User) => user.comments)
  @Field(() => User)
  public user: User;

  // @ManyToOne(() => Product, (product: Product) => product.comments)
  // @Field(() => Product)
  // public product: Product;

  // @ManyToOne(() => Movie, (movie) => movie.comments)
  // @Field(() => Movie)
  // public movie: Movie;

  @Column()
  @Field()
  public contents: string;
}
