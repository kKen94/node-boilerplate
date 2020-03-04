import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsUUID, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company';
import { PasswordHistory } from './password-history';
import { Permission } from './permission';
import { Person } from './person';
import { TokenVerification } from './token-verification';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string;

  @Column()
  @IsNotEmpty()
  @Length(4, 100)
  public passwordHash: string;

  @Column({ default: () => `localtimestamp + interval '3 month'` })
  @IsDate()
  public passwordExpiration?: Date;

  @Column({ default: 3 })
  @IsInt()
  public passwordHistoryLimit?: number;

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

  // TODO: qualcosa non va con il cascade

  @OneToMany(
    () => TokenVerification,
    tokenVerification => tokenVerification.user,
    { cascade: true },
  )
  public tokenVerifications: TokenVerification[];

  @OneToMany(
    () => PasswordHistory,
    passwordHistory => passwordHistory.user,
    { cascade: true },
  )
  public passwordHistories: PasswordHistory[];

  @ManyToMany(
    () => Permission,
    permission => permission.users,
    { cascade: true },
  )
  @JoinTable()
  public permissions: Permission[];

  @OneToOne(
    () => Person,
    person => person.user,
    { cascade: true },
  )
  @JoinColumn()
  public person: Person;

  @RelationId((user: User) => user.person)
  public personId: string;

  @ManyToOne(
    () => Company,
    company => company.users,
  )
  public company: Company;

  @RelationId((user: User) => user.company)
  public companyId: string;
}
