
-- manually added the line. It adds the extension for uuid functinalities
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS "category" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"category_name" varchar(256) NOT NULL,
	"category_slug" varchar NOT NULL,
	"parent_category_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_category_name_unique" UNIQUE("category_name"),
	CONSTRAINT "category_category_slug_unique" UNIQUE("category_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_category" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT product_category_product_id_category_id PRIMARY KEY("product_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"product_name" varchar(256) NOT NULL,
	"product_description" text NOT NULL,
	"product_slug" varchar NOT NULL,
	"price" double precision NOT NULL,
	"compare_at_price" double precision,
	"is_trending" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_name_idx" ON "category" ("category_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_slug_idx" ON "category" ("category_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_name_idx" ON "product" ("product_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_slug_idx" ON "product" ("product_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_idx" ON "product" ("price");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_parent_category_id_category_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_category" ADD CONSTRAINT "product_category_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_category" ADD CONSTRAINT "product_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
