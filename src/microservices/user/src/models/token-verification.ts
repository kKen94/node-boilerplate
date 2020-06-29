import { normalizeDbDate } from '@helper';
import { IsDate, IsNotEmpty, IsUUID, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user';

@Entity()
export class TokenVerification {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(6, 6)
  public token: string;

  @Column()
  @CreateDateColumn({ update: false })
  public get createdAt(): Date {
    return normalizeDbDate(this._createdAt);
  }
  public set createdAt(date: Date) {
    this._createdAt = date;
  }

  @Column({ default: () => `localtimestamp + interval '1 hour'` })
  @IsDate()
  public get expiredAt(): Date {
    return normalizeDbDate(this._expiredAt);
  }
  public set expiredAt(date: Date) {
    this._expiredAt = date;
  }

  @ManyToOne(() => User, user => user.tokenVerifications)
  public user: User;

  @RelationId((token: TokenVerification) => token.user)
  public userId: string;

  /************************************************************/

  private _createdAt: Date;
  private _expiredAt: Date;
}
