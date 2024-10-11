import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserEntity1718883580075 implements MigrationInterface {
    name = 'AddedUserEntity1718883580075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("u_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying NOT NULL, "email" character varying NOT NULL, "Cognito_id" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "PK_6849b86df19860994f6ac692814" PRIMARY KEY ("u_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
