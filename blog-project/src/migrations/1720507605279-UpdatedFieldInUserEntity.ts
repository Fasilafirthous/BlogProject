import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedFieldInUserEntity1720507605279 implements MigrationInterface {
    name = 'UpdatedFieldInUserEntity1720507605279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profile_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profile_url" SET NOT NULL`);
    }

}
