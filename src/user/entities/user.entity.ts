import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';

@Entity()
export class User extends BaseEntity {
  // username, email, password, phone
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public phone: number;

  @Column({ nullable: true })
  public profileImg?: string;

  @BeforeInsert()
  async beforeSaveFunction(): Promise<void> {
    // 패스워드 암호화
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
}
