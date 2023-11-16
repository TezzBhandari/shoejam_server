CREATE TABLE IF NOT EXISTS "brand" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"brand_name" varchar(50),
	"brand_slug" varchar(100)
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "category_product_Variation" (
	"category_id" uuid,
	"product_variation_id" uuid,
	CONSTRAINT category_product_Variation_category_id_product_variation_id PRIMARY KEY("category_id","product_variation_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_category" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT product_category_product_id_category_id PRIMARY KEY("product_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subProduct_varitionValue" (
	"sub_product_id" uuid,
	"variation_value_id" uuid,
	CONSTRAINT subProduct_varitionValue_sub_product_id_variation_value_id PRIMARY KEY("sub_product_id","variation_value_id")
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
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"brand_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_image" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"image_url" text NOT NULL,
	"sub_product_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "product_image_image_url_unique" UNIQUE("image_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variation" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"variation_name" varchar NOT NULL,
	"variation_slug" varchar NOT NULL,
	CONSTRAINT "product_variation_variation_name_unique" UNIQUE("variation_name"),
	CONSTRAINT "product_variation_variation_slug_unique" UNIQUE("variation_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variation_value" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"variation_value_name" varchar NOT NULL,
	"product_variation_id" uuid,
	CONSTRAINT "product_variation_value_variation_value_name_unique" UNIQUE("variation_value_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sub_product" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sku" varchar NOT NULL,
	"price" double precision,
	"quantity" integer DEFAULT 0,
	"item_sold" integer DEFAULT 0,
	"product_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sub_product_sku_unique" UNIQUE("sku")
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
 ALTER TABLE "category_product_Variation" ADD CONSTRAINT "category_product_Variation_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_product_Variation" ADD CONSTRAINT "category_product_Variation_product_variation_id_product_variation_id_fk" FOREIGN KEY ("product_variation_id") REFERENCES "product_variation"("id") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subProduct_varitionValue" ADD CONSTRAINT "subProduct_varitionValue_sub_product_id_sub_product_id_fk" FOREIGN KEY ("sub_product_id") REFERENCES "sub_product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subProduct_varitionValue" ADD CONSTRAINT "subProduct_varitionValue_variation_value_id_product_variation_id_fk" FOREIGN KEY ("variation_value_id") REFERENCES "product_variation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_brand_id_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_image" ADD CONSTRAINT "product_image_sub_product_id_sub_product_id_fk" FOREIGN KEY ("sub_product_id") REFERENCES "sub_product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variation_value" ADD CONSTRAINT "product_variation_value_product_variation_id_product_variation_id_fk" FOREIGN KEY ("product_variation_id") REFERENCES "product_variation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_product" ADD CONSTRAINT "sub_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
