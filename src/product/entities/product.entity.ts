import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { Comment } from '@root/comment/entities/comment.entity';

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

  @OneToMany(() => Comment, (comment: Comment) => comment.product)
  @JoinColumn()
  public comments: Comment[];
}
