import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
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
  public createdAt: Date;

  @ManyToOne(
    () => User,
    user => user.passwordHistories,
  )
  public user: User;

  @RelationId((password: PasswordHistory) => password.user)
  public userId: string;
}
