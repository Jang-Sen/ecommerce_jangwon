import { Column, Entity } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product extends Base {
  @Column()
  @Field()
  public name: string;

  @Column()
  @Field()
  public price: number;

  @Column()
  @Field()
  public description: string;

  @Column()
  @Field()
  public category: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  @Field(() => [String])
  public productImg?: string[];

  // @OneToMany(() => Comment, (comment: Comment) => comment.product)
  // @Field(() => [Comment])
  // public comments: Comment[];
}
