CREATE TABLE IF NOT EXISTS "sub_product_variation_value" (
	"sub_product_id" uuid,
	"variation_value_id" uuid,
	CONSTRAINT sub_product_variation_value_sub_product_id_variation_value_id PRIMARY KEY("sub_product_id","variation_value_id")
);
--> statement-breakpoint
DROP TABLE "sub_product_varition_value";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_product_variation_value" ADD CONSTRAINT "sub_product_variation_value_sub_product_id_sub_product_id_fk" FOREIGN KEY ("sub_product_id") REFERENCES "sub_product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_product_variation_value" ADD CONSTRAINT "sub_product_variation_value_variation_value_id_product_variation_value_id_fk" FOREIGN KEY ("variation_value_id") REFERENCES "product_variation_value"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
