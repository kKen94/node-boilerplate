import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableUserPhoneNumber1582658908016 implements MigrationInterface {
    name = 'NullableUserPhoneNumber1582658908016'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT (LOCALTIMESTAMP + '3 mons'`, undefined);
    }

}
