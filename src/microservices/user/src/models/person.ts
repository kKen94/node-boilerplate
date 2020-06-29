import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(0, 50)
  public firstName: string;

  @Column()
  @IsNotEmpty()
  @Length(0, 50)
  public lastName: string;

  @OneToOne(() => User, user => user.person)
  public user: User;
}
