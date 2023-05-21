import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProductsTable1684187951808 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "products" (
      "id" "uuid" DEFAULT "uuid_generate_v4"() NOT NULL,
      "platform_id" text,
      "name" "text",
      CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "products_platform_id_unique" UNIQUE ("platform_id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "products" CASCADE');
  }
}
