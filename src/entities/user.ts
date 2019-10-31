import * as bcrypt from 'bcryptjs';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
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
  public id: string;

  @Column()
  @Length(5, 20)
  public username: string;

  @Column()
  @Length(4, 100)
  public passwordHash: string;

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

  @Column()
  @IsNotEmpty()
  public role: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  @IsDate()
  public lastLogin: Date;

  @Column({ default: true })
  @IsBoolean()
  public active: boolean;

  public hashPassword() {
    this.passwordHash = bcrypt.hashSync(this.passwordHash, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.passwordHash);
  }
}
