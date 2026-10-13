import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_modality" AS ENUM('in-person', 'online', 'hybrid');
  ALTER TABLE "event_types" ADD COLUMN "format" varchar;
  ALTER TABLE "events" ADD COLUMN "format" varchar;
  ALTER TABLE "events" ADD COLUMN "modality" "enum_events_modality" DEFAULT 'in-person';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "event_types" DROP COLUMN "format";
  ALTER TABLE "events" DROP COLUMN "format";
  ALTER TABLE "events" DROP COLUMN "modality";
  DROP TYPE "public"."enum_events_modality";`)
}
