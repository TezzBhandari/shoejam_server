import { eq, sql } from "drizzle-orm";

import db from "../../../../db/client";
import {
  Category,
  InsertCategoryType,
  SelectCategoryType,
} from "../../../../db/schema";

// Prepared Statements
const SelectCategoryByNamePreparedStatement = () => {
  return db
    .select()
    .from(Category)
    .where(eq(Category.category_name, sql.placeholder("category_name")))
    .prepare("select_category_by_name");
};

const SelectCategoryPreparedStatement = () => {
  return db.select().from(Category).prepare("select_category");
};

const SelectCategoryByParentIdPreparedStatement = () => {
  return db
    .select()
    .from(Category)
    .where(
      eq(Category.parent_category_id, sql.placeholder("parent_category_id"))
    )
    .prepare("select_category_by_parent_id");
};

// db queries
const InsertCategory = async (
  category: InsertCategoryType
): Promise<Array<SelectCategoryType>> => {
  return db
    .insert(Category)
    .values({
      category_name: category.category_name,
      category_slug: category.category_slug,
    })
    .returning();
};

const SelectCategory = async (): Promise<Array<SelectCategoryType>> => {
  const prepared = SelectCategoryPreparedStatement();
  return prepared.execute();
};

const SelectCategoryByName = async ({
  category_name,
}: {
  category_name: string;
}): Promise<Array<SelectCategoryType>> => {
  const prepared = SelectCategoryByNamePreparedStatement();

  return prepared.execute({ category_name });
};

const SelectCategoryByParentId = async ({
  parent_category_id,
}: {
  parent_category_id: string;
}): Promise<Array<SelectCategoryType>> => {
  const prepared = SelectCategoryByParentIdPreparedStatement();
  return prepared.execute({ parent_category_id });
};

export {
  InsertCategory,
  SelectCategory,
  SelectCategoryByName,
  SelectCategoryByParentId,
};
