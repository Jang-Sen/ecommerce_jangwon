import { Column, Entity } from 'typeorm';
import { Base } from '@common/entities/base.entity';

@Entity()
export class Movie extends Base {
  @Column()
  adult: boolean;

  @Column()
  backdrop_path: string;

  @Column({ type: 'simple-array' })
  genre_ids: number[];

  @Column()
  mid: number;

  @Column()
  original_language: string;

  @Column()
  original_title: string;

  @Column()
  overview: string;

  @Column('decimal', { precision: 10, scale: 2 })
  popularity: number;
}
