import { Router } from "express";

import {
  AddRootCategory,
  AddSubCategory,
  RetrieveAllCategory,
} from "../../../controllers/product_inventory/product_category";

const router = Router();

router.post("/root-category", AddRootCategory);
router.post("/:category_id/sub-category", AddSubCategory);
router.get("/root-category", RetrieveAllCategory);

export default router;
