import { eq } from "drizzle-orm";

import db from "../../../../db/client";
import {
  Category,
  InsertCategoryType,
  SelectCategoryType,
} from "../../../../db/schema";

const InsertCategory = async (
  category: InsertCategoryType
): Promise<Array<SelectCategoryType>> => {
  return db.insert(Category).values(category).returning();
};

const SelectCategory = async (): Promise<Array<SelectCategoryType>> => {
  return db.select().from(Category);
};

const SelectCategoryByName = async ({
  category_name,
}: {
  category_name: string;
}): Promise<Array<SelectCategoryType>> => {
  return db
    .select()
    .from(Category)
    .where(eq(Category.category_name, category_name));
};

const SelectParentCategoryById = async ({
  category_id,
}: {
  category_id: string;
}): Promise<Array<SelectCategoryType>> => {
  return db
    .select()
    .from(Category)
    .where(eq(Category.parent_category_id, category_id));
};

export {
  InsertCategory,
  SelectCategory,
  SelectCategoryByName,
  SelectParentCategoryById,
};

// const newUser: NewUser = { name: "Alef" };
// await InsertCategory(newUser);
