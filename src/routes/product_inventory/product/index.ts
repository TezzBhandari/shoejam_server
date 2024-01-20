import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.post("/new", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "add product" });
});

export default router;
