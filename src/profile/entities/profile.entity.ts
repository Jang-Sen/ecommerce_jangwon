import { Column, Entity, OneToOne } from 'typeorm';
import { Base } from '@common/entities/base.entity';
import { User } from '@user/entities/user.entity';
import { Gender } from '@profile/entities/gender.enum';

@Entity()
export class Profile extends Base {
  // user(One To One)
  @OneToOne(() => User, (user) => user.profile)
  public user: User;

  // 생년월일
  @Column()
  public birth?: Date;

  // 성별 (Enum)
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.DEFAULT,
  })
  public gender: Gender;

  // 한줄 소개
  @Column()
  public introduce?: string;

  // sns 링크
  @Column()
  public snsLink?: string;
}
