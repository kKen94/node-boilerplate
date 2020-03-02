import { IsDate, IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  public createdAt: Date;

  @Column({ default: () => `localtimestamp + interval '10 minute'` })
  @IsDate()
  public tokenExpiration?: Date;

  @ManyToOne(
    () => User,
    user => user.tokenVerifications,
  )
  public user: User;
}
