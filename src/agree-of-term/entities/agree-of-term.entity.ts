import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@user/entities/user.entity';

@Entity()
export class AgreeOfTerm {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user: User) => user.agreeOfTerm)
  public user: User;

  @Column({
    default: false,
  })
  public overFourteen: boolean;

  @Column({
    default: false,
  })
  public agreeOfTerm: boolean;

  @Column({
    default: false,
  })
  public agreeOfPersonalInfo: boolean;

  @Column({
    default: false,
  })
  public agreeOfMarketing: boolean;

  @Column({
    default: false,
  })
  public agreeOfEvent: boolean;
}
