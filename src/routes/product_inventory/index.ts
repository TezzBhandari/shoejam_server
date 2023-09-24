import { Router } from "express";
import CustomError from "../../errors/CustomError";
import { ErrorCode, ErrorType } from "../../errors/types";
import productCategoryRoutes from "./product_category";

const router = Router();

router.use("/product-category", productCategoryRoutes);

export default router;
