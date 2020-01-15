import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @Length(5, 20)
  public username: string;

  @Column()
  @Length(4, 100)
  public passwordHash: string;

  // TODO: trovare il modo di settare 3 mesi di default come valore sql
  @Column()
  @IsDate()
  public passwordExpiration: Date;

  @Column({ default: 3 })
  @IsInt()
  public passwordHistoryLimit: number;

  @Column({ default: false })
  @IsBoolean()
  public forceResetPassword: boolean;

  @Column()
  @IsEmail()
  public email: string;

  @Column({ default: false })
  @IsBoolean()
  public emailConfirmed: boolean;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ default: false })
  @IsBoolean()
  public phoneNumberConfirmed: boolean;

  @Column({ default: false })
  @IsBoolean()
  public twoFactorEnabled: boolean;

  @Column({ default: false })
  @IsBoolean()
  public deleted: boolean;

  // TODO: deve diventare una relazione
  @Column()
  @IsNotEmpty()
  public role: string;

  @Column()
  @CreateDateColumn({ update: false })
  public createdAt: Date;

  @Column()
  @UpdateDateColumn({ update: false })
  public updatedAt: Date;

  @Column({ nullable: true })
  @IsDate()
  public lastLogin?: Date;

  @Column({ nullable: true })
  @IsDate()
  public activeFrom?: Date;

  @Column({ nullable: true })
  @IsDate()
  public activeTo?: Date;

  @Column({ default: true })
  @IsBoolean()
  public active: boolean;
}
