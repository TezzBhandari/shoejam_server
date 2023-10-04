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
      parent_category_id: category.parent_category_id,
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

const SelectCategoryHierarchy = () => {
  return db.execute(sql<string>`
    WITH RECURSIVE CategoryHierarchy AS (
    SELECT
        id,
        category_name,
        category_slug,
        parent_category_id,
        NULL::VARCHAR AS parent_category_name,
        1 as level
    FROM
        category
    WHERE
        parent_category_id IS NULL

    UNION ALL

    SELECT
        C.id,
        C.category_name,
        C.category_slug,
        C.parent_category_id,
        CH.category_name AS parent_category_name,
        level + 1 AS level

    FROM
        category C
    JOIN
        CategoryHierarchy CH ON C.parent_category_id = CH.id
)

SELECT
    id,
    category_name,
    category_slug,
    parent_category_id,
    parent_category_name,
    level as category_level
FROM
    CategoryHierarchy
    ;
  
  `);
};

// select the category and all of its subcateogry by id
const SelectCategoryHierarchyById = ({
  category_id,
}: {
  category_id: string;
}) => {
  return db.execute(sql<string>`
    WITH RECURSIVE CategoryHierarchy AS (
    SELECT
        id,
        category_name,
        category_slug,
        parent_category_id,
        1 as level
    FROM
        category
    WHERE
        id = ${category_id}

    UNION ALL

    SELECT
        C.id,
        C.category_name,
        C.category_slug,
        C.parent_category_id,
        level + 1 AS level

    FROM
        category C
    JOIN
        CategoryHierarchy CH ON C.parent_category_id = CH.id
)

SELECT
    CH.id,
    CH.category_name,
    CH.category_slug,
    CH.parent_category_id,
    C.category_name as parent_category_name,
    CH.level as category_level
FROM
    CategoryHierarchy CH
JOIN
      category C
    ON  CH.parent_category_id = C.id;
  `);
};

export {
  InsertCategory,
  SelectCategory,
  SelectCategoryByName,
  SelectCategoryByParentId,
  SelectCategoryHierarchy,
  SelectCategoryHierarchyById,
};
