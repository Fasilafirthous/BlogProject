import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedBlogEntity1719910865135 implements MigrationInterface {
    name = 'UpdatedBlogEntity1719910865135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "title_img"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "title_img" character varying NOT NULL`);
    }

}
