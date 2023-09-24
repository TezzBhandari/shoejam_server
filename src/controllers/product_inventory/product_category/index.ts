import { NextFunction, Request, Response } from "express";

import prisma from "../../../db/prisma";
import CustomError from "../../../errors/CustomError";
import { ErrorCode, ErrorMessage, ErrorType } from "../../../errors/types";

// Type Definition for adding root category route request body
export interface RootCategoryRequestBody {
  category_name: string;
}

// Type Definition for adding sub category route request body
export interface SubCategoryRequestBody {
  sub_category_name: string;
  parent_category_id: string;
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
    const { category_name }: RootCategoryRequestBody = req.body;

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
    const conflict = await prisma.category.findUnique({
      where: {
        category_name,
      },
    });

    if (conflict) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating category slug out of name by replaceing spaces with hypen
    const category_slug = category_name.replace(/\s+/g, "-");

    // creating new category
    const new_category = await prisma.category.create({
      data: {
        category_name,
        category_slug,
      },
      select: {
        category_name: true,
        category_slug: true,
        created_at: true,
      },
    });

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
        property: "category name",
      });
    }

    // check of parent category exists
    const parent_category = await prisma.category.findUnique({
      where: {
        id: category_id,
      },
    });

    if (parent_category === null) {
      throw new CustomError({
        errorCode: ErrorCode.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
        property: "parent_category",
      });
    }

    // check of conflict resource sub-category
    const conflict = await prisma.category.findUnique({
      where: {
        category_name: sub_category_name,
      },
    });

    if (conflict) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating sub-cateogry slug out fo subcategory name
    const sub_category_slug = sub_category_name.replace(/\s+/g, "-");

    // new sub category
    const new_sub_category = await prisma.category.create({
      data: {
        category_name: sub_category_name,
        category_slug: sub_category_slug,
        parent_category_id: category_id, // If it's a top-level category
      },
      select: {
        category_name: true,
        category_slug: true,
        created_at: true,
        // parent_cateogry: true,

        parent_cateogry: {
          select: {
            category_name: true,
          },
        },
      },
    });

    // SENDING SUCCESFULL RESPONSE
    res.status(201).json({
      status: "success",
      data: {
        new_sub_category: {
          sub_category_name: new_sub_category.category_name,
          sub_category_slug: new_sub_category.category_slug,
          created_at: new_sub_category.created_at,
          parent_category: new_sub_category.parent_cateogry?.category_name,
        },
      },
      errors: null,
    });
  } catch (error) {
    // SENDS ERROR TO  ERROR HANDLING MIDDLEWARE
    next(error);
  }
};

export { AddRootCategory, AddSubCategory };
