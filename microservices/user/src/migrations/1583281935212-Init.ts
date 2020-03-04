import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1583281935212 implements MigrationInterface {
    name = 'Init1583281935212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_da65ed4600e5e6bc9315754a8b2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "token_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT localtimestamp + interval '10 minute', "userId" uuid, CONSTRAINT "PK_ea81d45fc8e141e7ede6d1ec414" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "passwordHash" character varying NOT NULL, "passwordExpiration" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT localtimestamp + interval '3 month', "passwordHistoryLimit" integer NOT NULL DEFAULT 3, "forceResetPassword" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "phoneNumberConfirmed" boolean NOT NULL DEFAULT false, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP WITH TIME ZONE, "activeFrom" TIMESTAMP WITH TIME ZONE, "activeTo" TIMESTAMP WITH TIME ZONE, "active" boolean NOT NULL DEFAULT true, "personId" uuid, "companyId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_6aac19005cea8e2119cbe7759e" UNIQUE ("personId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "vatNumber" character varying, CONSTRAINT "UQ_b03e07e9369260e8ff971fe3745" UNIQUE ("vatNumber"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_permissions_permission" ("userId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_8dd49853fbad35f9a0f91b11877" PRIMARY KEY ("userId", "permissionId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5b72d197d92b8bafbe7906782e" ON "user_permissions_permission" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c43a6a56e3ef281cbfba9a7745" ON "user_permissions_permission" ("permissionId") `, undefined);
        await queryRunner.query(`ALTER TABLE "password_history" ADD CONSTRAINT "FK_20c510e5ca12f63b0c915c3e2df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "token_verification" ADD CONSTRAINT "FK_40fb11a1e64e40626ecef43c57b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6aac19005cea8e2119cbe7759e8" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6aac19005cea8e2119cbe7759e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "token_verification" DROP CONSTRAINT "FK_40fb11a1e64e40626ecef43c57b"`, undefined);
        await queryRunner.query(`ALTER TABLE "password_history" DROP CONSTRAINT "FK_20c510e5ca12f63b0c915c3e2df"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c43a6a56e3ef281cbfba9a7745"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5b72d197d92b8bafbe7906782e"`, undefined);
        await queryRunner.query(`DROP TABLE "user_permissions_permission"`, undefined);
        await queryRunner.query(`DROP TABLE "company"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "token_verification"`, undefined);
        await queryRunner.query(`DROP TABLE "person"`, undefined);
        await queryRunner.query(`DROP TABLE "permission"`, undefined);
        await queryRunner.query(`DROP TABLE "password_history"`, undefined);
    }

}
