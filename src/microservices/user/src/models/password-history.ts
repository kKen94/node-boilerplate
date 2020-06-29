import { normalizeDbDate } from '@helper';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';
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
export class PasswordHistory {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(4, 100)
  public passwordHash: string;

  @Column()
  @CreateDateColumn({ update: false })
  public get createdAt(): Date {
    return normalizeDbDate(this._createdAt);
  }
  public set createdAt(date: Date) {
    this._createdAt = date;
  }

  @ManyToOne(() => User, user => user.passwordHistories)
  public user: User;

  @RelationId((password: PasswordHistory) => password.user)
  public userId: string;

  /*************************/

  private _createdAt: Date;
}
