import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOrdersTable1684187972727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "orders" (
			"id" "uuid" DEFAULT "uuid_generate_v4"() NOT NULL,
			"platform_id" text,
			CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "orders_platform_id_unique" UNIQUE ("platform_id")
		)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "orders" CASCADE');
  }
}
