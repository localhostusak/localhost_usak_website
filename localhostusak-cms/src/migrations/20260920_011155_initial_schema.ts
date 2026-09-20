import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_status" AS ENUM('upcoming', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_careers_type" AS ENUM('job', 'internship', 'freelance', 'mentorship');
  CREATE TYPE "public"."enum_careers_work_mode" AS ENUM('remote', 'hybrid', 'onsite');
  CREATE TYPE "public"."enum_careers_schedule" AS ENUM('fulltime', 'parttime', 'project');
  CREATE TYPE "public"."enum_projects_type" AS ENUM('showcase', 'seeking_team', 'opensource');
  CREATE TYPE "public"."enum_sponsors_tier" AS ENUM('gold', 'silver', 'bronze', 'community');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "event_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"icon" varchar DEFAULT '☕' NOT NULL,
  	"color_modern" varchar DEFAULT '#FF6600' NOT NULL,
  	"color_pixel" varchar DEFAULT '#EE6C19' NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type_id" integer NOT NULL,
  	"status" "enum_events_status" DEFAULT 'upcoming' NOT NULL,
  	"date_start" timestamp(3) with time zone NOT NULL,
  	"date_end" timestamp(3) with time zone,
  	"location" varchar,
  	"map_url" varchar,
  	"capacity" numeric,
  	"attendees" numeric DEFAULT 0,
  	"cover_image_id" integer,
  	"image_url" varchar,
  	"whatsapp_link" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "careers_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"company" varchar,
  	"type" "enum_careers_type" DEFAULT 'job' NOT NULL,
  	"work_mode" "enum_careers_work_mode" DEFAULT 'remote',
  	"schedule" "enum_careers_schedule" DEFAULT 'fulltime',
  	"description" varchar,
  	"apply_url" varchar,
  	"contact" varchar,
  	"posted_by" varchar,
  	"is_active" boolean DEFAULT true,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "projects_roles_needed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_projects_type" DEFAULT 'showcase' NOT NULL,
  	"owner" varchar,
  	"team_size" numeric DEFAULT 1,
  	"team_max" numeric,
  	"github_url" varchar,
  	"demo_url" varchar,
  	"cover_image_id" integer,
  	"image_url" varchar,
  	"likes" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tier" "enum_sponsors_tier" DEFAULT 'community',
  	"logo_id" integer,
  	"logo_url" varchar,
  	"website_url" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "community_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"event_types_id" integer,
  	"events_id" integer,
  	"careers_id" integer,
  	"projects_id" integer,
  	"sponsors_id" integer,
  	"community_links_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "general_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_site_title" varchar DEFAULT 'localhostusak — Uşak''ın Teknoloji ve Tasarım Topluluğu' NOT NULL,
  	"meta_default_description" varchar DEFAULT 'Uşak''taki yazılımcılar, tasarımcılar, remote çalışanlar ve öğrenciler için açık, samimi ve üretken teknoloji topluluğu. Kahveni al, laptopunu getir!' NOT NULL,
  	"meta_keywords" varchar DEFAULT 'Uşak yazılım, Uşak teknoloji, localhostusak, developer community, UI UX Uşak, Uşak meetup, remote çalışma, coworking',
  	"meta_og_image_id" integer,
  	"header_announcement_active" boolean DEFAULT false,
  	"header_announcement_text" varchar DEFAULT '🎉 Yeni buluşma takvimimiz açıklandı! Detaylar etkinlikler sayfasında.',
  	"header_announcement_url" varchar DEFAULT '/etkinlikler',
  	"footer_tagline" varchar DEFAULT 'Uşak''ın yerel teknoloji, yazılım ve tasarım ekosistemini büyüten açık ve bağımsız topluluk.',
  	"footer_location_coordinates" varchar DEFAULT '38.6823° N, 29.4082° E',
  	"footer_copyright_text" varchar DEFAULT '© 2026 localhostusak • Uşak''ta sevgiyle kodlandı 🧡',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" numeric NOT NULL,
  	"prefix" varchar DEFAULT '',
  	"suffix" varchar DEFAULT '',
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"tags" varchar
  );
  
  CREATE TABLE "site_settings_personas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"tags" varchar
  );
  
  CREATE TABLE "site_settings_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_career_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_city_coordinates" varchar DEFAULT '38.6823° N, 29.4082° E',
  	"hero_title" varchar DEFAULT 'Uşak''ın Teknoloji ve',
  	"hero_title_highlight" varchar DEFAULT 'Tasarım Topluluğu',
  	"hero_subtitle" varchar DEFAULT 'connect • build • collaborate • grow',
  	"hero_description" varchar DEFAULT 'Kahveni al, laptopunu getir, aramıza katıl. Deneyimli olmak şart değil; merakın ve öğrenme isteğin varsa masada sana da yer var.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tag" varchar DEFAULT '// ETKİNLİK TAKVİMİ & COWORKING' NOT NULL,
  	"hero_title" varchar DEFAULT 'Cowork''ten Workshop''a,' NOT NULL,
  	"hero_highlight_text" varchar DEFAULT 'Tüm Buluşmalar' NOT NULL,
  	"hero_description" varchar DEFAULT 'Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak''ta aynı masada.' NOT NULL,
  	"whatsapp_cta_button_text" varchar DEFAULT 'WhatsApp Coworking Grubuna Katıl',
  	"whatsapp_cta_override_url" varchar,
  	"meta_title" varchar DEFAULT 'Etkinlikler & Coworking — localhostusak',
  	"meta_description" varchar DEFAULT 'Uşak''taki yazılım, tasarım ve yapay zeka buluşmaları, coworking günleri ve workshop takvimi.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "careers_page_settings_career_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "careers_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tag" varchar DEFAULT '// KARİYER & FIRSAT PANOSU' NOT NULL,
  	"hero_title" varchar DEFAULT 'Uşak''tan Globale,' NOT NULL,
  	"hero_highlight_text" varchar DEFAULT 'Doğru Fırsatı Yakala' NOT NULL,
  	"hero_description" varchar DEFAULT 'Topluluk üyelerinin paylaştığı iş ilanları, staj fırsatları, freelance projeler ve ücretsiz mentorluk eşleşmeleri.' NOT NULL,
  	"whatsapp_cta_button_text" varchar DEFAULT 'WhatsApp Kariyer Grubuna Katıl',
  	"whatsapp_cta_override_url" varchar,
  	"meta_title" varchar DEFAULT 'Kariyer & İlanlar — localhostusak',
  	"meta_description" varchar DEFAULT 'Uşak ve uzaktan çalışma olanakları; teknoloji, yazılım, staj ve freelance kariyer fırsatları panosu.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_page_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tag" varchar DEFAULT '// PROJE VİTRİNİ & AÇIK KAYNAK' NOT NULL,
  	"hero_title" varchar DEFAULT 'Uşak''ta Üretiliyor,' NOT NULL,
  	"hero_highlight_text" varchar DEFAULT 'Dünyaya Açılıyor' NOT NULL,
  	"hero_description" varchar DEFAULT 'Topluluk üyelerimizin geliştirdiği açık kaynak projeler, erken aşama girişimler ve birlikte üretmek için ekip arkadaşı arayanlar.' NOT NULL,
  	"whatsapp_cta_button_text" varchar DEFAULT 'WhatsApp Projeler Grubuna Katıl',
  	"whatsapp_cta_override_url" varchar,
  	"meta_title" varchar DEFAULT 'Projeler & Vitrin — localhostusak',
  	"meta_description" varchar DEFAULT 'Uşak teknoloji topluluğu üyelerinin geliştirdiği projeler, açık kaynak depoları ve ekip arkadaşı arayan girişimler.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_type_id_event_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."event_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_technologies" ADD CONSTRAINT "careers_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_roles_needed" ADD CONSTRAINT "projects_roles_needed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_types_fk" FOREIGN KEY ("event_types_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_community_links_fk" FOREIGN KEY ("community_links_id") REFERENCES "public"."community_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "general_settings" ADD CONSTRAINT "general_settings_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_values" ADD CONSTRAINT "site_settings_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_personas" ADD CONSTRAINT "site_settings_personas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_flow_steps" ADD CONSTRAINT "site_settings_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_career_resources" ADD CONSTRAINT "site_settings_career_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_settings_career_resources" ADD CONSTRAINT "careers_page_settings_career_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "event_types_slug_idx" ON "event_types" USING btree ("slug");
  CREATE INDEX "event_types_updated_at_idx" ON "event_types" USING btree ("updated_at");
  CREATE INDEX "event_types_created_at_idx" ON "event_types" USING btree ("created_at");
  CREATE INDEX "events_tags_order_idx" ON "events_tags" USING btree ("_order");
  CREATE INDEX "events_tags_parent_id_idx" ON "events_tags" USING btree ("_parent_id");
  CREATE INDEX "events_type_idx" ON "events" USING btree ("type_id");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "careers_technologies_order_idx" ON "careers_technologies" USING btree ("_order");
  CREATE INDEX "careers_technologies_parent_id_idx" ON "careers_technologies" USING btree ("_parent_id");
  CREATE INDEX "careers_updated_at_idx" ON "careers" USING btree ("updated_at");
  CREATE INDEX "careers_created_at_idx" ON "careers" USING btree ("created_at");
  CREATE INDEX "projects_technologies_order_idx" ON "projects_technologies" USING btree ("_order");
  CREATE INDEX "projects_technologies_parent_id_idx" ON "projects_technologies" USING btree ("_parent_id");
  CREATE INDEX "projects_roles_needed_order_idx" ON "projects_roles_needed" USING btree ("_order");
  CREATE INDEX "projects_roles_needed_parent_id_idx" ON "projects_roles_needed" USING btree ("_parent_id");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE UNIQUE INDEX "community_links_key_idx" ON "community_links" USING btree ("key");
  CREATE INDEX "community_links_updated_at_idx" ON "community_links" USING btree ("updated_at");
  CREATE INDEX "community_links_created_at_idx" ON "community_links" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_event_types_id_idx" ON "payload_locked_documents_rels" USING btree ("event_types_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_careers_id_idx" ON "payload_locked_documents_rels" USING btree ("careers_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_community_links_id_idx" ON "payload_locked_documents_rels" USING btree ("community_links_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "general_settings_meta_meta_og_image_idx" ON "general_settings" USING btree ("meta_og_image_id");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_values_order_idx" ON "site_settings_values" USING btree ("_order");
  CREATE INDEX "site_settings_values_parent_id_idx" ON "site_settings_values" USING btree ("_parent_id");
  CREATE INDEX "site_settings_personas_order_idx" ON "site_settings_personas" USING btree ("_order");
  CREATE INDEX "site_settings_personas_parent_id_idx" ON "site_settings_personas" USING btree ("_parent_id");
  CREATE INDEX "site_settings_flow_steps_order_idx" ON "site_settings_flow_steps" USING btree ("_order");
  CREATE INDEX "site_settings_flow_steps_parent_id_idx" ON "site_settings_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "site_settings_career_resources_order_idx" ON "site_settings_career_resources" USING btree ("_order");
  CREATE INDEX "site_settings_career_resources_parent_id_idx" ON "site_settings_career_resources" USING btree ("_parent_id");
  CREATE INDEX "careers_page_settings_career_resources_order_idx" ON "careers_page_settings_career_resources" USING btree ("_order");
  CREATE INDEX "careers_page_settings_career_resources_parent_id_idx" ON "careers_page_settings_career_resources" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "event_types" CASCADE;
  DROP TABLE "events_tags" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "careers_technologies" CASCADE;
  DROP TABLE "careers" CASCADE;
  DROP TABLE "projects_technologies" CASCADE;
  DROP TABLE "projects_roles_needed" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "community_links" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "general_settings" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_values" CASCADE;
  DROP TABLE "site_settings_personas" CASCADE;
  DROP TABLE "site_settings_flow_steps" CASCADE;
  DROP TABLE "site_settings_career_resources" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "events_page_settings" CASCADE;
  DROP TABLE "careers_page_settings_career_resources" CASCADE;
  DROP TABLE "careers_page_settings" CASCADE;
  DROP TABLE "projects_page_settings" CASCADE;
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum_careers_type";
  DROP TYPE "public"."enum_careers_work_mode";
  DROP TYPE "public"."enum_careers_schedule";
  DROP TYPE "public"."enum_projects_type";
  DROP TYPE "public"."enum_sponsors_tier";`)
}
