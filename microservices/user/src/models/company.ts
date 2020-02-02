import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['vatNumber'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(0, 30)
  public name: string;

  @Column()
  @IsNotEmpty()
  @Length(0, 30)
  public vatNumber: string;

  @OneToMany(
    () => User,
    user => user.company,
  )
  public users: User[];
}
