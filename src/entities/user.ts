import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import {
  Length,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDate,
  IsInt
} from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(5, 20)
  username: string;

  @Column()
  @Length(4, 100)
  passwordHash: string;

  @Column()
  @IsDate()
  passwordExpiration: Date;

  @Column({ default: 3 })
  @IsInt()
  passwordHistoryLimit: number;

  @Column({ default: false })
  @IsBoolean()
  forceResetPassword: boolean;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsBoolean()
  emailConfirmed: boolean;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  @IsBoolean()
  phoneNumberConfirmed: boolean;

  @Column({ default: false })
  @IsBoolean()
  twoFactorEnabled: boolean;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsDate()
  lastLogin: Date;

  @Column({ default: true })
  @IsBoolean()
  active: boolean;

  hashPassword() {
    this.passwordHash = bcrypt.hashSync(this.passwordHash, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.passwordHash);
  }
}
