import { Request, Response, NextFunction } from "express";

import GlobalCustomError from "../errors/GlobalCustomError";
import { ErrorCode, ErrorMessage } from "../errors/types";

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

  if (error.message.includes("invalid input syntax for type uuid:")) {
    return res.status(ErrorCode.BAD_REQUEST).json({
      status: "error",
      data: null,
      errors: [{ message: ErrorMessage.NOT_FOUND, property: "id" }],
    });
  }

  if (error.message.includes("request size did not match content length")) {
    return res.status(ErrorCode.BAD_REQUEST).json({
      status: "error",
      data: null,
      errors: [{ message: error.message, property: "" }],
    });
  }

  // debug console
  console.error(error);
  // Server unknown errors are handled here
  res.status(500).json({
    status: "error",
    data: null,
    errors: [{ message: "Server Error. Try Again", property: "" }],
  });
};

export { errorHandler };
