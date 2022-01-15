import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1642269311530 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`COMMENT ON COLUMN "block"."parentId" IS NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "parentId" SET DEFAULT null`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "block"."post" IS NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "post" SET DEFAULT null`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "post" DROP DEFAULT`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "block"."post" IS NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "parentId" DROP DEFAULT`, undefined);
        await queryRunner.query(`COMMENT ON COLUMN "block"."parentId" IS NULL`, undefined);
   }

}
