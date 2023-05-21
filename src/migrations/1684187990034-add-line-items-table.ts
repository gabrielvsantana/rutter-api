import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLineItemsTable1684187990034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "line_items" (
      "id" "uuid" DEFAULT "uuid_generate_v4"() NOT NULL,
      "platform_id" text,
      "product_id" "uuid",
      "order_id" "uuid",
      CONSTRAINT "line_items_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "line_items_platform_id_unique" UNIQUE ("platform_id"),
      CONSTRAINT "line_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "line_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "line_items" CASCADE');
  }
}
