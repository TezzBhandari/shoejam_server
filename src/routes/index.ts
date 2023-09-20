import { Router, Request, Response } from "express";

import productInventoryRoutes from "./product_inventory";

const router = Router();

/**
 * route: checks the status of server
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ server: "working" });
});

router.use("/admin/product-inventory", productInventoryRoutes);

export default router;
