import {MigrationInterface, QueryRunner} from "typeorm";

export class Person1580655309463 implements MigrationInterface {
    name = 'Person1580655309463'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "vatNumber" character varying NOT NULL, CONSTRAINT "UQ_b03e07e9369260e8ff971fe3745" UNIQUE ("vatNumber"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "personId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6aac19005cea8e2119cbe7759e8" UNIQUE ("personId")`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "companyId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6aac19005cea8e2119cbe7759e8" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6aac19005cea8e2119cbe7759e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT (LOCALTIMESTAMP + '3 mons'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "companyId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6aac19005cea8e2119cbe7759e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "personId"`, undefined);
        await queryRunner.query(`DROP TABLE "company"`, undefined);
        await queryRunner.query(`DROP TABLE "person"`, undefined);
    }

}
