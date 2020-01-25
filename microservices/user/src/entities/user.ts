import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsUUID,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordHistory } from './password-history';
import { Permission } from './permission';

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

  @Column({ default: () => `localtimestamp + interval '3 month'` })
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

  @OneToMany(
    () => PasswordHistory,
    (passwordHistory) => passwordHistory.user,
  )
  // @OneToMany(() => PasswordHistory, passwordHistory => passwordHistory.user, {eager: true}) Le carica subito
  public passwordHistories: PasswordHistory[];
  // public passwordHistories: Promise<PasswordHistory[]>; LAZY LOADING

  @ManyToMany(() => Permission)
  @JoinTable()
  public permissions: Permission[];

  // TODO: mettere i lazy loading?
}
