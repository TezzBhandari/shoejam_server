import { Router } from "express";

import {
  AddRootCategory,
  AddSubCategory,
} from "../../../controllers/product_inventory/product_category";

const router = Router();

router.post("/add-root-category", AddRootCategory);
router.post("/:categoryId/add-sub-category", AddSubCategory);

export default router;
