// import { NextFunction, Request, Response } from "express";

// import prisma from "../../../db/prisma_client";
// import { errorHandler } from "../../../lib/middlewares/errorHandler";
// import ValidationError from "../../../lib/utils/errors/ValidationError";
// import ConflictError from "../../../lib/utils/errors/ConflictError";
// import AbsenceException from "../../../lib/utils/errors/AbsenceException";

// export interface RootCategoryRequestBody {
//   category_name: string;
// }

// export interface SubCategoryRequestBody extends RootCategoryRequestBody {
//   parent_category: string;
// }

// /**
//  * adds the root category in category table
//  * @param req express request object
//  * @param res express response object
//  */

// const AddRootCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { category_name }: RootCategoryRequestBody = req.body;

//     // check for empty field
//     if (!category_name) {
//       throw new ValidationError("category name missing", "category name");
//     }

//     // check of conflict resource
//     const conflict = await prisma.categories.findUnique({
//       where: {
//         category_name,
//       },
//     });

//     if (conflict) {
//       throw new ConflictError("category name already exists", "category name");
//     }

//     // creating new category
//     const newCategory = await prisma.categories.create({
//       data: {
//         category_name,
//       },
//       select: {
//         category_name: true,
//       },
//     });

//     res.status(201).json({
//       status: "success",
//       data: { new_root_category: newCategory },
//       errors: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * adds the subcategory of a category
//  * @param req express request object
//  * @param res express response object
//  * @param next epxress next function
//  */

// const AddSubCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { categoryId } = req.params;
//     const { category_name }: SubCategoryRequestBody = req.body;

//     if (!categoryId) {
//       throw new ValidationError("parent category id missing", "category id");
//     }

//     if (!category_name) {
//       throw new ValidationError("category name missing", "category name");
//     }

//     // check of parent category exists
//     const parentCategory = await prisma.categories.findUnique({
//       where: {
//         id: parseInt(categoryId),
//       },
//     });

//     if (parentCategory === null) {
//       throw new AbsenceException(
//         "parent category doesn't exists",
//         "parent category"
//       );
//     }

//     const conflict = await prisma.categories.findUnique({
//       where: {
//         category_name,
//       },
//     });

//     if (conflict) {
//       throw new ConflictError("category name already exists", "category name");
//     }

//     // new sub category
//     const newCategory = await prisma.categories.create({
//       data: {
//         category_name,
//         parent_category_id: parseInt(categoryId), // If it's a top-level category
//       },
//       select: {
//         category_name: true,
//         parent_category: {
//           select: {
//             category_name: true,
//           },
//         },
//       },
//     });

//     res.status(201).json({
//       status: "success",
//       data: {
//         new_sub_category: newCategory,
//       },
//       errors: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export { AddRootCategory, AddSubCategory };
