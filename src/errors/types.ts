// serializing errors
export interface SerializedErrorType {
  message: string;
  property?: string;
}

// error type
export enum ErrorType {
  CONFLICT = "CONFLICT",
  BAD_REQUEST = "BAD REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// error codes
export enum ErrorCode {
  // VALIDATION_ERROR = 400,
  CONFLICT = 409,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
