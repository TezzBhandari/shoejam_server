import { NextFunction, Request, Response } from "express";

import db from "../../../db/client";
import CustomError from "../../../errors/CustomError";
import { ErrorCode, ErrorMessage, ErrorType } from "../../../errors/types";
import { Category } from "../../../db/schema";
import { eq } from "drizzle-orm";

// Type Definition for adding root category route request body
export interface RootCategoryRequestBody {
  category_name: string;
  category_slug: string;
}

// Type Definition for adding sub category route request body
export interface SubCategoryRequestBody {
  sub_category_name: string;
  parent_category_id: string;
  sub_category_slug: string;
}

/**
 * adds the root category in category table
 * @param req express request object
 * @param res express response object
 */

const AddRootCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // extracting category name from request body
    let { category_name, category_slug }: RootCategoryRequestBody = req.body;

    // check for empty field
    if (!category_name) {
      //   throw new ValidationError("category name missing", "category name");
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        message: ErrorMessage.MISSING_FIELD,
        property: "category name",
      });
    }

    // check of conflict resource
    const conflict = await db
      .select()
      .from(Category)
      .where(eq(Category.category_name, category_name));

    if (conflict) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating category slug out of name by replaceing spaces with hypen

    if (!category_slug) {
      category_slug = category_name.replace(/\s+/g, "-").toLowerCase();
    }
    // creating new category
    const category_insert_res = await db
      .insert(Category)
      .values({ category_name, category_slug })
      .returning();

    const new_category = category_insert_res[0];
    // SENDING SUCCESFULL RESPONSE
    res.status(201).json({
      status: "success",
      data: {
        new_root_category: {
          category_name: new_category.category_name,
          category_slug: new_category.category_slug,
          created_at: new_category.created_at,
        },
      },
      errors: null,
    });
  } catch (error) {
    // SENDS ERROR TO  ERROR HANDLING MIDDLEWARE
    next(error);
  }
};

/**
 * handler: lists all categories
 */
const RetrieveAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await db.select().from(Category);
    if (!categories) {
      throw new CustomError({
        errorCode: ErrorCode.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND,
        message: "resource not found",
        property: "",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * adds the subcategory of a category
 * @param req express request object
 * @param res express response object
 * @param next epxress next function
 */

const AddSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //extracting category id from request params
    console.log(req.params);
    const { category_id } = req.params;

    // extracting category name from request body
    const { sub_category_name }: SubCategoryRequestBody = req.body;

    if (!category_id) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: "parent category_id params missing",
        property: "category_id",
      });
    }

    if (!sub_category_name) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        message: ErrorMessage.MISSING_FIELD,
        property: "sub category name",
      });
    }

    // check of parent category exists
    const parent_category = await db
      .select()
      .from(Category)
      .where(eq(Category.id, category_id));

    if (parent_category === null) {
      throw new CustomError({
        errorCode: ErrorCode.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
        property: "parent_category",
      });
    }

    // check of conflict resource sub-category
    const conflict = await db
      .select()
      .from(Category)
      .where(eq(Category.category_name, sub_category_name));

    if (conflict) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating sub-cateogry slug out fo subcategory name
    const sub_category_slug = sub_category_name
      .replace(/\s+/g, "-")
      .toLowerCase();

    // new sub category
    const new_sub_category_insert_res = await db
      .insert(Category)
      .values({
        category_name: sub_category_name,
        category_slug: sub_category_slug,
        parent_category_id: category_id,
      })
      .returning();
    const new_sub_category = new_sub_category_insert_res[0];
    // SENDING SUCCESFULL RESPONSE
    res.status(201).json({
      status: "success",
      data: {
        new_sub_category: {
          sub_category_name: new_sub_category.category_name,
          sub_category_slug: new_sub_category.category_slug,
          created_at: new_sub_category.created_at,
          // parent_category: new_sub_category.parent_cateogry?.category_name,
        },
      },
      errors: null,
    });
  } catch (error) {
    // SENDS ERROR TO  ERROR HANDLING MIDDLEWARE
    next(error);
  }
};

export { AddRootCategory, AddSubCategory, RetrieveAllCategory };
