import { Router } from "express";

import {
  CreateCategoryHandler,
  CreateSubCategoryHandler,
  RetrieveCategoryHierarchyByIdHandler,
  RetrieveCategoryHierarchyHandler,
  UpdateCategoryHandler,
} from "../../../controllers/product_inventory/product_category";

const router = Router();

router.post("/", CreateCategoryHandler);
router.post("/:category_id/sub-category", CreateSubCategoryHandler);
router.get("/", RetrieveCategoryHierarchyHandler);
router.get("/:category_id", RetrieveCategoryHierarchyByIdHandler);
router.put("/:category_id", UpdateCategoryHandler);

export default router;
