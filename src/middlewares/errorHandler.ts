import { Request, Response, NextFunction } from "express";

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

  console.error(error);
  // Server unknown errors are handled here
  res.status(500).json({
    status: "error",
    data: null,
    errors: [{ message: "Server Error. Try Again", property: "" }],
  });
};

export { errorHandler };
