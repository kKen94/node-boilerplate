import { IsDate, IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
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

  @Column({ default: () => `localtimestamp + interval '1 hour'` })
  @IsDate()
  public expiredAt: Date;

  @ManyToOne(
    () => User,
    user => user.tokenVerifications,
  )
  public user: User;

  @RelationId((token: TokenVerification) => token.user)
  public userId: string;
}
