import { ErrorCode, ErrorType, SerializedErrorType } from "./types";

/**
 * Base template for Error on this api server
 */
abstract class GlobalCustomError extends Error {
  abstract errorCode: ErrorCode;
  abstract errorType: ErrorType;
  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): Array<SerializedErrorType>;
}

export default GlobalCustomError;
