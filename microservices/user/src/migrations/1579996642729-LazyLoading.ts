import {MigrationInterface, QueryRunner} from "typeorm";

export class LazyLoading1579996642729 implements MigrationInterface {
    name = 'LazyLoading1579996642729'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("username", "email")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT (LOCALTIMESTAMP + '3 mons'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`, undefined);
    }

}
