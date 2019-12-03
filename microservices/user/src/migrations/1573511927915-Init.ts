import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1573511927915 implements MigrationInterface {
    name = 'Init1573511927915'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordExpiration" TIMESTAMP NOT NULL DEFAULT '"2020-02-10T23:00:00.000Z"', "passwordHistoryLimit" integer NOT NULL DEFAULT 3, "forceResetPassword" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "phoneNumberConfirmed" boolean NOT NULL DEFAULT false, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
