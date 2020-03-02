import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenVerification1583173665074 implements MigrationInterface {
    name = 'TokenVerification1583173665074'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "token_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "tokenExpiration" TIMESTAMP NOT NULL DEFAULT localtimestamp + interval '10 minute', "userId" uuid, CONSTRAINT "PK_ea81d45fc8e141e7ede6d1ec414" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
        await queryRunner.query(`ALTER TABLE "token_verification" ADD CONSTRAINT "FK_40fb11a1e64e40626ecef43c57b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "token_verification" DROP CONSTRAINT "FK_40fb11a1e64e40626ecef43c57b"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT (LOCALTIMESTAMP + '3 mons'`, undefined);
        await queryRunner.query(`DROP TABLE "token_verification"`, undefined);
    }

}
