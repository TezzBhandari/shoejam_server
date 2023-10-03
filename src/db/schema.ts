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
} from "drizzle-orm/pg-core";

// Category Table: stores the category of products
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

  // one to many realtion: category hierarchy tree
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

// application level relation
export const CategoryRelations = relations(Category, ({ many }) => ({
  products: many(JoinProductCategory),
  // subcategories: many(Category, { relationName: "sub_category" }),
  // parent_category: one(Category, {
  //   fields: [Category.parent_category_id],
  //   references: [Category.id],
  //   relationName: "parent_category",
  // }),
}));

// types of insert and slect category
export type InsertCategoryType = typeof Category.$inferInsert;
export type SelectCategoryType = typeof Category.$inferSelect;

// Product Table: stores the product detail like product_name, product_description, etc
export const Product = pgTable(
  "product",
  {
    id: uuid("id")
      .notNull()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    product_name: varchar("product_name", { length: 256 }).notNull(),
    product_description: text("product_description").notNull(),
    product_slug: varchar("product_slug").notNull(),
    price: doublePrecision("price").notNull(),
    compare_at_price: doublePrecision("compare_at_price"),
    is_trending: boolean("is_trending").default(false).notNull(),
    is_published: boolean("is_published").default(false).notNull(),
    is_featured: boolean("is_featured").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (product_table) => {
    return {
      product_name_idx: index("product_name_idx").on(
        product_table.product_name
      ),
      product_slug_idx: index("product_slug_idx").on(
        product_table.product_slug
      ),
      price_idx: index("price_idx").on(product_table.price),
    };
  }
);

// application level product realtion
export const ProductRelations = relations(Product, ({ many }) => ({
  categories: many(JoinProductCategory),
}));

// Join Table: product and category
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

  // composite primary key: product_id + category_id
  (productCategory) => ({
    pk: primaryKey(productCategory.product_id, productCategory.category_id),
  })
);

// application level relationship of product and category
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
