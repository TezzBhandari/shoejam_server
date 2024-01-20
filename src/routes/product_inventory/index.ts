import { Router } from "express";
import CustomError from "../../errors/CustomError";
import { ErrorCode, ErrorType } from "../../errors/types";
import productCategoryRoutes from "./product_category";
import productRoutes from "./product";

const router = Router();

router.use("/category", productCategoryRoutes);
router.use("/product", productRoutes);

export default router;
