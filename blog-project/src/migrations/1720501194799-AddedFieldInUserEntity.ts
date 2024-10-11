import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFieldInUserEntity1720501194799 implements MigrationInterface {
    name = 'AddedFieldInUserEntity1720501194799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_url"`);
    }

}
