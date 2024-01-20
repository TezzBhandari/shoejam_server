import { NextFunction, Request, Response, RequestHandler } from "express";
import { z } from "zod";

// PRODUCT SCHEMA
const productSchema = z.object({
  productName: z
    .string({
      required_error: "product name is required",
      invalid_type_error: "product name must be a string",
    })
    .trim(),
  productDescription: z
    .string({
      required_error: "product description is required",
      invalid_type_error: "product description must be a string",
    })
    .trim(),
  productSlug: z
    .string({
      required_error: "product slug is required",
      invalid_type_error: "product slug must be a string",
    })
    .trim(),
  productPrice: z.number({
    required_error: "product price is required",
    invalid_type_error: "product price must be a number",
  }),
  compareAtPrice: z
    .number({
      invalid_type_error: "product's compare at price must be a number",
    })
    .optional(),
  category: z.string({
    required_error: "product category is required",
    invalid_type_error: "product category must be a string",
  }),
});

const productWithSubItemsSchema = productSchema.extend({
  subProduct: z
    .object({
      sku: z.string({
        required_error: "product sku is required",
        invalid_type_error: "product sku must be string",
      }),
      itemPrice: z.number().optional(),
      quantity: z.number().optional(),
      itemSold: z.number().optional(),
      productId: z.string(),
    })
    .array()
    .optional(),
});

const variationSchema = z
  .object({ name: z.string(), values: z.string().array() })
  .array();

const AddProduct = (req: Request, res: Response, next: NextFunction) => {};

export { AddProduct };

// {
//         required_error: "product sku is required",
//         invalid_type_error: "product sku must be string",
//       }
