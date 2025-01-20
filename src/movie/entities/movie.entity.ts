import { Column, Entity } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Movie extends Base {
  @Column()
  @Field()
  public adult: boolean;

  @Column()
  @Field()
  public poster_path: string;

  @Column({ type: 'simple-array' })
  @Field(() => [Number])
  public genre_ids: number[];

  @Column()
  @Field()
  public mid: number;

  @Column()
  @Field()
  public original_language: string;

  @Column()
  @Field()
  public original_title: string;

  @Column()
  @Field()
  public overview: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  public popularity: number;

  // @OneToMany(() => Comment, (comment) => comment.movie)
  // public comments: Comment[];
}
