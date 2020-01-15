import {MigrationInterface, QueryRunner} from "typeorm";

export class DeletedUserField1579117375404 implements MigrationInterface {
    name = 'DeletedUserField1579117375404'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" DROP DEFAULT`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT '2020-02-10 23:00:00'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted"`, undefined);
    }

}
