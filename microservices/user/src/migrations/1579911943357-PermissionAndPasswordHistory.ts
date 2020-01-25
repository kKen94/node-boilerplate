import {MigrationInterface, QueryRunner} from "typeorm";

export class PermissionAndPasswordHistory1579911943357 implements MigrationInterface {
    name = 'PermissionAndPasswordHistory1579911943357'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "password_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_da65ed4600e5e6bc9315754a8b2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_permissions_permission" ("userId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_8dd49853fbad35f9a0f91b11877" PRIMARY KEY ("userId", "permissionId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5b72d197d92b8bafbe7906782e" ON "user_permissions_permission" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_c43a6a56e3ef281cbfba9a7745" ON "user_permissions_permission" ("permissionId") `, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`, undefined);
        await queryRunner.query(`ALTER TABLE "password_history" ADD CONSTRAINT "FK_20c510e5ca12f63b0c915c3e2df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" ADD CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_c43a6a56e3ef281cbfba9a77457"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_permissions_permission" DROP CONSTRAINT "FK_5b72d197d92b8bafbe7906782ec"`, undefined);
        await queryRunner.query(`ALTER TABLE "password_history" DROP CONSTRAINT "FK_20c510e5ca12f63b0c915c3e2df"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c43a6a56e3ef281cbfba9a7745"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5b72d197d92b8bafbe7906782e"`, undefined);
        await queryRunner.query(`DROP TABLE "user_permissions_permission"`, undefined);
        await queryRunner.query(`DROP TABLE "permission"`, undefined);
        await queryRunner.query(`DROP TABLE "password_history"`, undefined);
    }

}
