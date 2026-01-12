import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ValidationError } from "class-validator";
import { errorResponse } from "../utils/response.util";

/**
 * Global exception filter to format all errors
 * Validation errors are formatted as field-level (key: message[])
 * Other errors are formatted as message arrays
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let messages: string[] | Record<string, string[]>;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.name;

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        messages = [exceptionResponse];
      } else if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as any;

        // Handle validation errors
        // Check if this is a BadRequestException with validation errors
        if (exception instanceof BadRequestException) {
          // When BadRequestException is thrown with an object directly,
          // getResponse() returns that object, not wrapped in a message property
          // Check if the response itself is a Record<string, string[]> (Zod format)
          if (
            !Array.isArray(responseObj) &&
            responseObj !== null &&
            typeof responseObj === "object" &&
            Object.keys(responseObj).length > 0 &&
            !responseObj.message &&
            !responseObj.error
          ) {
            // Check if values are arrays (field-level format from Zod)
            const firstValue = Object.values(responseObj)[0];
            if (Array.isArray(firstValue)) {
              // Already in field-level format (from Zod)
              messages = responseObj as Record<string, string[]>;
            } else {
              // Not in expected format
              messages = [exception.message || "Validation failed"];
            }
          }
          // Check if message is already formatted as Record<string, string[]> (nested format)
          else if (
            typeof responseObj.message === "object" &&
            !Array.isArray(responseObj.message) &&
            responseObj.message !== null &&
            Object.keys(responseObj.message).length > 0
          ) {
            // Check if values are arrays (field-level format)
            const firstValue = Object.values(responseObj.message)[0];
            if (Array.isArray(firstValue)) {
              // Already in field-level format (from Zod)
              messages = responseObj.message as Record<string, string[]>;
            } else {
              // Not in expected format
              messages = [exception.message || "Validation failed"];
            }
          }
          // Check if it's class-validator format (ValidationError[])
          else if (
            Array.isArray(responseObj.message) &&
            responseObj.message.length > 0 &&
            typeof responseObj.message[0] === "object" &&
            "property" in responseObj.message[0]
          ) {
            // Format validation errors by field (class-validator)
            messages = this.formatValidationErrors(
              responseObj.message as ValidationError[],
            );
          }
          // Regular array of string messages
          else if (Array.isArray(responseObj.message)) {
            messages = responseObj.message;
          }
          // String message
          else if (typeof responseObj.message === "string") {
            messages = [responseObj.message];
          } else {
            messages = [exception.message || "An error occurred"];
          }
        } else if (Array.isArray(responseObj.message)) {
          // Regular array of string messages
          messages = responseObj.message;
        } else if (typeof responseObj.message === "string") {
          messages = [responseObj.message];
        } else {
          messages = [exception.message || "An error occurred"];
        }

        // Use error type from response if available
        if (responseObj.error) {
          error = responseObj.error;
        }
      } else {
        messages = [exception.message || "An error occurred"];
      }
    } else {
      // Handle non-HTTP exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = "Internal Server Error";
      messages = [
        exception instanceof Error
          ? exception.message
          : "An unexpected error occurred",
      ];
    }

    const errorResponseObj = errorResponse(messages, status, error);

    response.status(status).json(errorResponseObj);
  }

  /**
   * Format validation errors by field name
   * @param validationErrors - Array of ValidationError from class-validator
   * @returns Object with field names as keys and error messages as arrays
   */
  private formatValidationErrors(
    validationErrors: ValidationError[],
  ): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    validationErrors.forEach((error) => {
      const fieldName = error.property;
      const fieldErrors: string[] = [];

      // Extract constraint messages
      if (error.constraints) {
        Object.values(error.constraints).forEach((message) => {
          fieldErrors.push(message);
        });
      }

      // Handle nested validation errors (for nested objects)
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        Object.keys(nestedErrors).forEach((nestedField) => {
          const fullFieldName = `${fieldName}.${nestedField}`;
          formattedErrors[fullFieldName] = nestedErrors[nestedField];
        });
      }

      // Only add field if it has errors
      if (fieldErrors.length > 0) {
        formattedErrors[fieldName] = fieldErrors;
      }
    });

    return formattedErrors;
  }
}
