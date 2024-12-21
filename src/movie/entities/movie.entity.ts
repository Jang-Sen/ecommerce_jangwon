import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { Comment } from '@root/comment/entities/comment.entity';

@Entity()
export class Movie extends Base {
  @Column()
  public adult: boolean;

  @Column()
  public poster_path: string;

  @Column({ type: 'simple-array' })
  public genre_ids: number[];

  @Column()
  public mid: number;

  @Column()
  public original_language: string;

  @Column()
  public original_title: string;

  @Column()
  public overview: string;

  @Column('decimal', { precision: 10, scale: 2 })
  public popularity: number;

  @OneToMany(() => Comment, (comment) => comment.movie)
  public comments: Comment[];
}
