import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import CustomError from "../../../errors/CustomError";
import { ErrorCode, ErrorMessage, ErrorType } from "../../../errors/types";
import {
  DeleteCategoryById,
  InsertCategory,
  SelectCategoryById,
  SelectCategoryByName,
  SelectCategoryByParentId,
  SelectCategoryHierarchy,
  SelectCategoryHierarchyById,
  SelectProductOfACategory,
  UpdateCategory,
} from "./db_utils";

// Type Definition for request body of root category route
export interface CategoryRequestBody {
  category_name: string;
}

// type definition for request params in sub_category route
export interface SubCategoryRequestParams {
  category_id: string;
}

export interface DeleteCategoryParmas extends SubCategoryRequestParams {}

export interface UpdateCategoryRequestParams extends SubCategoryRequestParams {}
export interface UpdateSubCategoryRequestParams {
  sub_category_id: string;
}

export interface RetrieveCategoryHierarchyByIdRequestParams
  extends SubCategoryRequestParams {}

// type definition for request body of subcateogory route
export interface SubCategoryRequestBody {
  sub_category_name: string;
}

/**
 * adds the root category in category table
 * @param req express request object
 * @param res express response object
 */

const CreateCategoryHandler = async (
  req: Request<{}, {}, CategoryRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    // extracting category name from request body
    const { category_name } = req.body;

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
    const conflict = await SelectCategoryByName({ category_name });

    if (conflict.length !== 0) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating category slug out of name by replaceing spaces with hypen

    const category_slug =
      category_name.replace(/\s+/g, "-").toLowerCase() + "-" + uuidv4();

    // creating new category
    const category_insert_response = await InsertCategory({
      category_name,
      category_slug,
    });

    const new_category = category_insert_response[0];
    // SENDING SUCCESFULL RESPONSE
    res.status(201).json({
      status: "success",
      data: {
        category: {
          id: new_category.id,
          category_name: new_category.category_name,
          category_slug: new_category.category_slug,
          updated_at: new_category.updated_at,
          parent_category: new_category.parent_category_id,
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

const CreateSubCategoryHandler = async (
  req: Request<SubCategoryRequestParams, {}, SubCategoryRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    //extracting category id from request params
    const { category_id } = req.params;

    // extracting category name from request body
    const { sub_category_name } = req.body;

    console.log(req.body);

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
    const parent_category = await SelectCategoryByParentId({
      parent_category_id: category_id,
    });

    if (parent_category.length === 0) {
      throw new CustomError({
        errorCode: ErrorCode.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND,
        message: ErrorMessage.NOT_FOUND,
        property: "parent_category",
      });
    }

    // check of conflict resource sub-category
    const conflict = await SelectCategoryByName({
      category_name: sub_category_name,
    });

    if (conflict.length !== 0) {
      throw new CustomError({
        errorCode: ErrorCode.CONFLICT,
        errorType: ErrorType.CONFLICT,
        message: ErrorMessage.ALREADY_EXIST,
        property: "category name",
      });
    }

    // creating sub-cateogry slug out fo subcategory name
    const sub_category_slug =
      sub_category_name.replace(/\s+/g, "-").toLowerCase() + "-" + uuidv4();

    console.log("ready to insert");
    const new_sub_category_insert_response = await InsertCategory({
      category_name: sub_category_name,
      category_slug: sub_category_slug,
      parent_category_id: category_id,
    });

    const new_sub_category = new_sub_category_insert_response[0];
    // SENDING SUCCESFULL RESPONSE
    res.status(201).json({
      status: "success",
      data: {
        sub_category: {
          sub_category_name: new_sub_category.category_name,
          sub_category_slug: new_sub_category.category_slug,
          created_at: new_sub_category.created_at,
          parent_category: new_sub_category.parent_category_id,
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

/**
 * handler: lists all categories
 */
const RetrieveCategoryHierarchyHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await SelectCategoryHierarchy();

    // if categories is empty, no item in the list

    // if (!categories) {
    //   throw new CustomError({
    //     errorCode: ErrorCode.NOT_FOUND,
    //     errorType: ErrorType.NOT_FOUND,
    //     message: "resource not found",
    //     property: "",
    //   });
    // }

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

// retrives category heirarcy by id
const RetrieveCategoryHierarchyByIdHandler = async (
  req: Request<RetrieveCategoryHierarchyByIdRequestParams, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    if (!category_id) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: "category_id params missing",
        property: "category_id",
      });
    }

    const categories = await SelectCategoryHierarchyById({ category_id });
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

const UpdateCategoryHandler = async (
  req: Request<UpdateCategoryRequestParams, {}, CategoryRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    const { category_name } = req.body;
    console.log(req.params, req.body);

    if (!category_id) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: "category_id params missing",
        property: "category_id",
      });
    }

    if (!category_name) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        message: ErrorMessage.MISSING_FIELD,
        property: "category name",
      });
    }

    const category_exist = await SelectCategoryById({ category_id });

    if (category_exist.length === 0) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: ErrorMessage.DOESNOT_EXIST,
        property: "category id",
      });
    }

    console.log("exists", category_exist);

    const parent_category_id = category_exist[0].parent_category_id;

    // create new slug for each update category or subcategory name
    const category_slug =
      category_name.replace(/\s+/g, "-").toLowerCase() + "-" + uuidv4();

    // update category
    const updated_category = await UpdateCategory({
      category_id,
      category_name,
      category_slug,
      parent_category_id,
    });

    res.status(200).json({
      status: "success",
      data: {
        updated_category,
      },
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// const UpdateSubCategoryHandler = async (
//   req: Request<UpdateSubCategoryRequestParams, {}, SubCategoryRequestBody>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { sub_category_id } = req.params;
//     const { sub_category_name } = req.body;

//     if (!sub_category_id) {
//       throw new CustomError({
//         errorCode: ErrorCode.BAD_REQUEST,
//         errorType: ErrorType.BAD_REQUEST,
//         message: "sub_category_id params missing",
//         property: "sub_category_id",
//       });
//     }

//     if (!sub_category_name) {
//       throw new CustomError({
//         errorCode: ErrorCode.BAD_REQUEST,
//         errorType: ErrorType.VALIDATION_ERROR,
//         message: ErrorMessage.MISSING_FIELD,
//         property: "subcategory name",
//       });
//     }

//     const category_exist = await SelectCategoryById({
//       category_id: sub_category_id,
//     });

//     if (category_exist.length === 0) {
//       throw new CustomError({
//         errorCode: ErrorCode.BAD_REQUEST,
//         errorType: ErrorType.BAD_REQUEST,
//         message: ErrorMessage.DOESNOT_EXIST,
//         property: "sub category id",
//       });
//     }

//     // create new slug for each update category or subcategory name
//     const sub_category_slug =
//       sub_category_name.replace(/\s+/g, "-").toLowerCase() + "-" + uuidv4();

//     // update category
//     const updated_sub_category = await UpdateCategory({
//       category_id: sub_category_id,
//       category_name: sub_category_name,
//       category_slug: sub_category_slug,
//       parent_category_id: null,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         updated_sub_category,
//       },
//       errors: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const DeleteCategoryHandler = async (
  req: Request<DeleteCategoryParmas, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;

    if (!category_id) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: "category_id params missing",
        property: "category_id",
      });
    }

    const category_exist = await SelectCategoryById({ category_id });

    if (category_exist.length === 0) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: ErrorMessage.DOESNOT_EXIST,
        property: "category id",
      });
    }

    // check if it has subcategory
    const sub_category_exist = await SelectCategoryByParentId({
      parent_category_id: category_id,
    });

    if (sub_category_exist.length !== 0) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message:
          "cannot delete category with subcategories. Remove subcategories first.",
        property: "",
      });
    }

    // check if it has any product

    const category_has_product = await SelectProductOfACategory({
      category_id,
    });

    if (category_has_product.length !== 0) {
      throw new CustomError({
        errorCode: ErrorCode.BAD_REQUEST,
        errorType: ErrorType.BAD_REQUEST,
        message: "cannot delete category with products. Remove product first.",
        property: "",
      });
    }

    const deleted_category = await DeleteCategoryById({ category_id });
    res.status(200).json({
      status: "success",
      data: {
        deleted_category,
      },
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

export {
  CreateCategoryHandler,
  CreateSubCategoryHandler,
  RetrieveCategoryHierarchyHandler,
  RetrieveCategoryHierarchyByIdHandler,
  UpdateCategoryHandler,
  // UpdateSubCategoryHandler,
  DeleteCategoryHandler,
};
