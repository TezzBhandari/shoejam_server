import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

import GlobalCustomError from "../errors/GlobalCustomError";

/**
 * custom error handling middleware
 * @param error
 * @param req express Request object
 * @param res express Response object
 * @param next
 * @returns
 */
const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof GlobalCustomError) {
    return res
      .status(error.errorCode)
      .json({ status: "error", data: null, errors: error.serializeErrors() });
  }

  // handle unique constraint error from prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be accessed in a type-safe manner
    if (error.code === "P2002") {
      console.error(
        "There is a unique constraint violation, a new category cannot be created with this name"
      );
      res.status(400).json({
        status: "error",
        data: null,
        errors: [
          { message: "Database Constraint Violation Error", property: "" },
        ],
      });
    }
  }

  // Server unknown errors are handled here
  res.status(500).json({
    status: "error",
    data: null,
    errors: [{ message: "Server Error. Try Again", property: "" }],
  });
};

export { errorHandler };
