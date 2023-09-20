export interface SerializedErrorType {
  message: string;
  property?: string;
}

export enum ErrorType {
  ABSENCE_EXCEPTION = "ABSENCE EXCEPTION",
  BAD_REQUEST = "BAD REQUEST",
}

export enum ErrorCode {
  ABSENCE_EXCEPTION = 409,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}