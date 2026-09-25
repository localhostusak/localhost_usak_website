import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_settings_vision_messages" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote" varchar NOT NULL,
      "tag" varchar,
      "author" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "site_settings_vision_messages" 
        ADD CONSTRAINT "site_settings_vision_messages_parent_id_fk" 
        FOREIGN KEY ("_parent_id") 
        REFERENCES "public"."site_settings"("id") 
        ON DELETE cascade 
        ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_vision_messages_order_idx" 
      ON "site_settings_vision_messages" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_vision_messages_parent_id_idx" 
      ON "site_settings_vision_messages" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_vision_messages" CASCADE;
  `)
}
