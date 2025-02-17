import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Provider } from '@user/entities/provider.enum';
import * as gravatar from 'gravatar';
import * as bcrypt from 'bcryptjs';
import { AgreeOfTerm } from '@root/agreeOfTerm/entities/agree-of-term.entity';
import { Role } from '@user/entities/role.enum';
import { Base } from '@common/entities/base.entity';
import { Comment } from '@root/comment/entities/comment.entity';
import { Profile } from '@root/profile/entities/profile.entity';

@Entity()
export class User extends Base {
  // username, email, password, phone
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude() // 비밀번호 숨김
  public password?: string;

  @Column({ nullable: true })
  public phone?: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  @Exclude()
  public roles: Role[];

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agreeOfTerm: AgreeOfTerm;

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  public comments: Comment[];

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    // 패스워드 암호화

    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);

        // 프로필 자동생성
        this.profileImg = gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
