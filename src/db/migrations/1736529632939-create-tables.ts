import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1736529632939 implements MigrationInterface {
  name = 'CreateTables1736529632939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "testimonials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "testimonial" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_63b03c608bd258f115a0a4a1060" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(70) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "photos" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "description" character varying, "destination_id" uuid, "user_id" uuid, CONSTRAINT "REL_c4404a2ee605249b508c623e68" UNIQUE ("user_id"), CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "destinations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "target" character varying(160) NOT NULL, "descriptive_text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "testimonials" ADD CONSTRAINT "FK_0ee5dcee3d185b6a8d5708d64cb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "photos" ADD CONSTRAINT "FK_6b06ec12092787a1b3d180a2637" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "photos" ADD CONSTRAINT "FK_c4404a2ee605249b508c623e68f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photos" DROP CONSTRAINT "FK_c4404a2ee605249b508c623e68f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "photos" DROP CONSTRAINT "FK_6b06ec12092787a1b3d180a2637"`,
    );
    await queryRunner.query(
      `ALTER TABLE "testimonials" DROP CONSTRAINT "FK_0ee5dcee3d185b6a8d5708d64cb"`,
    );
    await queryRunner.query(`DROP TABLE "destinations"`);
    await queryRunner.query(`DROP TABLE "photos"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "testimonials"`);
  }
}
