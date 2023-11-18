import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  primaryKey,
  foreignKey,
  index,
  doublePrecision,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// CATEGORY TABLE: stores the category of products
export const Category = pgTable(
  "category",
  {
    id: uuid("id")
      .notNull()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    category_name: varchar("category_name", { length: 256 }).notNull().unique(),
    category_slug: varchar("category_slug").notNull().unique(),
    //   parent_category_id: uuid("parent_category_id").references(() => Category.id),
    parent_category_id: uuid("parent_category_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },

  // ONE TO MANY RELATION: category hierarchy tree
  (category_table) => {
    return {
      category_parent_category_id_fkey: foreignKey({
        columns: [category_table.parent_category_id],
        foreignColumns: [category_table.id],
      }),

      category_name_idx: index("category_name_idx").on(
        category_table.category_name
      ),
      category_slug_idx: index("category_slug_idx").on(
        category_table.category_slug
      ),

      // categoryCategorySlugKey: unique("category_category_slug_key").on(
      //   category.categorySlug
      // ),
    };
  }
);

// APPLICATION LEVEL RELATION
export const CategoryRelations = relations(Category, ({ many }) => ({
  products: many(JoinProductCategory),
  // subcategories: many(Category, { relationName: "sub_category" }),
  // parent_category: one(Category, {
  //   fields: [Category.parent_category_id],
  //   references: [Category.id],
  //   relationName: "parent_category",
  // }),
  productVariations: many(JoinCategoryProductVariation),
}));

// TYPES OF INSERT AND SELECT CATEGORY
export type InsertCategoryType = typeof Category.$inferInsert;
export type SelectCategoryType = typeof Category.$inferSelect;

// BRAND TABLE
export const Brand = pgTable("brand", {
  id: uuid("id")
    .notNull()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  brandName: varchar("brand_name", { length: 50 }),
  brandSlug: varchar("brand_slug", { length: 100 }),
});

// APPLICATION LEVEL BRAND RELATIONS
const BrandRelation = relations(Brand, ({ one, many }) => ({
  products: many(Product),
}));

// PRODUCT VARIATION
export const ProductVariation = pgTable("product_variation", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  variationName: varchar("variation_name").notNull().unique(),
  variationSlug: varchar("variation_slug").notNull().unique(),
});

// APPLICATION LEVEL RELATION: ONE TO MANY, TABLES: (PRODUCT VARIATION AND PRODUCT VARIATION VALUE)
export const ProductVariationRelation = relations(
  ProductVariation,
  ({ many }) => ({
    variationValues: many(ProductVariationValue),
    categories: many(JoinCategoryProductVariation),
  })
);

// PRODUCT VARIATION VALUE
export const ProductVariationValue = pgTable("product_variation_value", {
  id: uuid("id")
    .notNull()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  variationValueName: varchar("variation_value_name").notNull().unique(),
  ProductVariationId: uuid("product_variation_id").references(
    () => ProductVariation.id
  ),
});

// APPLICATION LEVEL RELATION
export const ProductVariationValueRelation = relations(
  ProductVariationValue,
  ({ one, many }) => ({
    productVariation: one(ProductVariation, {
      fields: [ProductVariationValue.ProductVariationId],
      references: [ProductVariation.id],
    }),
    subProducts: many(JoinSubProductVariationValue),
  })
);

// PRODUCT IMAGES
export const ProductImage = pgTable(
  "product_image",
  {
    id: uuid("id")
      .notNull()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    imageUrl: text("image_url").notNull().unique(),
    subProductId: uuid("sub_product_id")
      .notNull()
      .references(() => SubProduct.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => Product.id),
  }
  //(productImageTable) => {
  //   return {
  //     subProduct_ProductImage_fk: {
  //       columns: []
  //     }
  //   }
  // }
);

export const ProductImageRelation = relations(ProductImage, ({ one }) => ({
  // product: one(Product, {
  //   fields: [ProductImage.productId],
  //   references: [Product.id],
  // }),

  subProduct: one(SubProduct, {
    fields: [ProductImage.subProductId],
    references: [SubProduct.id],
  }),
}));

// PRODUCT TABLE: stores the product detail like product_name, product_description, etc
export const Product = pgTable(
  "product",
  {
    id: uuid("id")
      .notNull()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    productName: varchar("product_name", { length: 256 }).notNull(),
    productDescription: text("product_description").notNull(),
    productSlug: varchar("product_slug").notNull(),
    price: doublePrecision("price").notNull(),
    compare_at_price: doublePrecision("compare_at_price"),
    isTrending: boolean("is_trending").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    // PRODUCT AND BRAND RELATIONSHIP
    brandId: uuid("brand_id").references(() => Brand.id),
  },
  (product_table) => {
    return {
      product_name_idx: index("product_name_idx").on(product_table.productName),
      product_slug_idx: index("product_slug_idx").on(product_table.productSlug),
      price_idx: index("price_idx").on(product_table.price),
    };
  }
);

// APPLICATION LEVEL PRODUCT RELATION
export const ProductRelations = relations(Product, ({ many, one }) => ({
  categories: many(JoinProductCategory),
  brand: one(Brand, {
    fields: [Product.brandId],
    references: [Brand.id],
  }),
  subProducts: many(SubProduct),
  thumnail: one(ProductImage, {
    fields: [Product.id],
    references: [ProductImage.productId],
  }),
}));

// JOIN TABLE: PRODUCT AND CATEGORY
export const JoinProductCategory = pgTable(
  "product_category",
  {
    product_id: uuid("product_id")
      .notNull()
      .references(() => Product.id),
    category_id: uuid("category_id")
      .notNull()
      .references(() => Category.id),
  },

  // COMPOSITE PRIMARY KEY: product_id + category_id
  (productCategory) => ({
    pk: primaryKey(productCategory.product_id, productCategory.category_id),
    // pk: primaryKey({
    //   columns: [productCategory.category_id, productCategory.product_id],
    // }),
  })
);

// APPLICATION LEVEL RELATION OF PRODUCT AND CATEGORY
export const JoinProductCategoryRelations = relations(
  JoinProductCategory,
  ({ one }) => ({
    product: one(Product, {
      fields: [JoinProductCategory.product_id],
      references: [Product.id],
    }),
    category: one(Category, {
      fields: [JoinProductCategory.category_id],
      references: [Category.id],
    }),
  })
);

// SUB PRODUCT
export const SubProduct = pgTable("sub_product", {
  id: uuid("id")
    .notNull()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  sku: varchar("sku").notNull().unique(),
  price: doublePrecision("price"),
  quantity: integer("quantity").default(0),
  itemSold: integer("item_sold").default(0),
  productId: uuid("product_id").references(() => Product.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// APPLICATON LEVEL RELATION
export const SubProductRelation = relations(SubProduct, ({ many, one }) => ({
  productVariationValues: many(JoinSubProductVariationValue),
  product: one(Product, {
    fields: [SubProduct.productId],
    references: [Product.id],
  }),
  productImages: many(ProductImage),
}));

// JOIN TABLE: SUB PRODUCT AND VARIATION VALUES
export const JoinSubProductVariationValue = pgTable(
  "sub_product_variation_value",
  {
    subProductId: uuid("sub_product_id").references(() => SubProduct.id),
    productVariationValueId: uuid("variation_value_id").references(
      () => ProductVariationValue.id
    ),
  },
  (subProductVariationValue) => {
    return {
      pk: primaryKey(
        subProductVariationValue.subProductId,
        subProductVariationValue.productVariationValueId
      ),
      // pk: primaryKey({
      //   columns: [
      //     subProductVariationValue.productVariationValueId,
      //     subProductVariationValue.subProductId,
      //   ],
      // }),
    };
  }
);

// APPLICATION LEVEL RELATION
const JoinSubProductVariationValueRelation = relations(
  JoinSubProductVariationValue,
  ({ one }) => ({
    subProduct: one(SubProduct, {
      fields: [JoinSubProductVariationValue.subProductId],
      references: [SubProduct.id],
    }),
    productVariationValue: one(ProductVariationValue, {
      fields: [JoinSubProductVariationValue.productVariationValueId],
      references: [ProductVariationValue.id],
    }),
  })
);

// JOIN TABLE: PRODUCT Variation VALUES AND CATEGORY
export const JoinCategoryProductVariation = pgTable(
  "category_product_variation",
  {
    categoryId: uuid("category_id").references(() => Category.id),
    productVariationId: uuid("product_variation_id").references(
      () => ProductVariation.id
    ),
  },
  (categoryProductVariation) => {
    return {
      // pk: primaryKey(
      //   categoryProductVariation.categoryId,
      //   categoryProductVariation.productVariationId
      // ),
      pk: primaryKey({
        columns: [
          categoryProductVariation.categoryId,
          categoryProductVariation.productVariationId,
        ],
      }),
    };
  }
);

// APPLICATION LEVEL RELATION
export const JoinCategoryProductVariationRelation = relations(
  JoinCategoryProductVariation,
  ({ one }) => ({
    category: one(Category, {
      fields: [JoinCategoryProductVariation.categoryId],
      references: [Category.id],
    }),
    productVariation: one(ProductVariation, {
      fields: [JoinCategoryProductVariation.productVariationId],
      references: [ProductVariation.id],
    }),
  })
);
