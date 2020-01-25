import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordExpirationDefault1579972831480 implements MigrationInterface {
    name = 'passwordExpirationDefault1579972831480'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" SET DEFAULT localtimestamp + interval '3 month'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordExpiration" DROP DEFAULT`, undefined);
    }

}
