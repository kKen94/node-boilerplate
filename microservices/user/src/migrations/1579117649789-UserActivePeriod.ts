import {MigrationInterface, QueryRunner} from "typeorm";

export class UserActivePeriod1579117649789 implements MigrationInterface {
    name = 'UserActivePeriod1579117649789'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "activeFrom" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "activeTo" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "activeTo"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "activeFrom"`, undefined);
    }

}
