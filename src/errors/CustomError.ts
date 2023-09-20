import GlobalCustomError from "./GlobalCustomError";
import { ErrorCode, ErrorType, SerializedErrorType } from "./types";



/**
 * Argument used for creating a new error
 */
export interface CustomErrorParams  {
  errorCode: ErrorCode,
  errorType: ErrorType,
  message: string,
  property? : string
}

/**
 * Creates a new Error
 * errorCode should be of type errorCode
 * errorType should be of type errorType
 * message should be stirng
 * property is optional string type 
 */
class CustomError extends GlobalCustomError {
  //  errorCode = 409;
  errorCode: ErrorCode
  errorType: ErrorType
  private property?: string
  //  errorType = "CONFLICT_ERROR";
  constructor( {errorCode, errorType, message, property}: CustomErrorParams) {
    super(message);
    this.errorCode = errorCode;
    this.errorType = errorType
    this.property = property
  }

  /**
   * 
   * @returns retuns the serialized error
   */
  serializeErrors(): SerializedErrorType[] {
    return [{ message: this.message, property: this.property }];
  }
}

export default CustomError;
