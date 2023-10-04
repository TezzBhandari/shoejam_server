import { Router } from "express";

import {
  AddRootCategory,
  AddSubCategory,
  RetrieveCategoryHierarchy,
  RetrieveCategoryHierarchyById,
} from "../../../controllers/product_inventory/product_category";

const router = Router();

router.post("/root-category", AddRootCategory);
router.post("/:category_id/sub-category", AddSubCategory);
router.get("/category", RetrieveCategoryHierarchy);
router.get("/category/:category_id", RetrieveCategoryHierarchyById);

export default router;
