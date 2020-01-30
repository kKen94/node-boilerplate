import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['name'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @Length(4, 20)
  public name: string;

  @Column()
  @IsNotEmpty()
  @Length(5, 100)
  public description: string;

  @ManyToMany(
    () => User,
    user => user.permissions,
  )
  public users: User[];
}
