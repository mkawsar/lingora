import { HttpStatus } from "@nestjs/common";

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = any> {
  success: true;
  statusCode: number;
  message: string[];
  data?: T;
  timestamp: string;
}

/**
 * Standard error response structure
 * Supports both field-level validation errors and general error messages
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string[] | Record<string, string[]>;
  error: string;
  timestamp: string;
}

/**
 * Create a success response
 * @param data - Response data
 * @param message - Success message(s)
 * @param statusCode - HTTP status code (default: 200)
 * @returns Formatted success response
 */
export function successResponse<T>(
  data?: T,
  message: string | string[] = "Operation successful",
  statusCode: number = HttpStatus.OK,
): SuccessResponse<T> {
  return {
    success: true,
    statusCode,
    message: Array.isArray(message) ? message : [message],
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error response
 * @param message - Error message(s) or field-level errors - will be converted to array or object
 * @param statusCode - HTTP status code (default: 400)
 * @param error - Error type/name (default: "Bad Request")
 * @returns Formatted error response
 */
export function errorResponse(
  message: string | string[] | Record<string, string[]>,
  statusCode: number = HttpStatus.BAD_REQUEST,
  error: string = "Bad Request",
): ErrorResponse {
  let formattedMessage: string[] | Record<string, string[]>;

  if (typeof message === "string") {
    formattedMessage = [message];
  } else if (Array.isArray(message)) {
    formattedMessage = message;
  } else {
    // Already a Record<string, string[]>
    formattedMessage = message;
  }

  return {
    success: false,
    statusCode,
    message: formattedMessage,
    error,
    timestamp: new Date().toISOString(),
  };
}
