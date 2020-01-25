import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
}
