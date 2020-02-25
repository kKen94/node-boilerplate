import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableVatNumber1582660333681 implements MigrationInterface {
    name = 'NullableVatNumber1582660333681'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "vatNumber" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "vatNumber" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT (LOCALTIMESTAMP + '3 mons'`, undefined);
    }

}
