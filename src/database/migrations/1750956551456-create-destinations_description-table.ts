import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDestinationsDescriptionTable1750956551456 implements MigrationInterface {
    name = 'CreateDestinationsDescriptionTable1750956551456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "destinations_description" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying, "title" character varying(100), "subtitle" character varying(100), CONSTRAINT "PK_5f49c6c7097fe841c9b114af1aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "destinations" DROP COLUMN "descriptive_text"`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD "price" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD "descriptionId" uuid`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD CONSTRAINT "UQ_ec232bcb90cf37ab1bfdc57735d" UNIQUE ("descriptionId")`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD CONSTRAINT "FK_ec232bcb90cf37ab1bfdc57735d" FOREIGN KEY ("descriptionId") REFERENCES "destinations_description"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destinations" DROP CONSTRAINT "FK_ec232bcb90cf37ab1bfdc57735d"`);
        await queryRunner.query(`ALTER TABLE "destinations" DROP CONSTRAINT "UQ_ec232bcb90cf37ab1bfdc57735d"`);
        await queryRunner.query(`ALTER TABLE "destinations" DROP COLUMN "descriptionId"`);
        await queryRunner.query(`ALTER TABLE "destinations" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "destinations" ADD "descriptive_text" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "destinations_description"`);
    }

}
