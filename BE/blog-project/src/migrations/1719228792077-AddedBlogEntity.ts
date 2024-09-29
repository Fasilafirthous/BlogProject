import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBlogEntity1719228792077 implements MigrationInterface {
    name = 'AddedBlogEntity1719228792077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blog_title" character varying NOT NULL, "blog_content" character varying NOT NULL, "title_img" character varying NOT NULL, "userId" uuid, "u_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "u_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "u_deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user"("u_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
