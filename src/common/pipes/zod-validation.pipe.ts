import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

/**
 * Zod validation pipe for NestJS
 * Validates request data against Zod schemas
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors to match our error response format
        const formattedErrors = this.formatZodErrors(error);
        // Throw BadRequestException with the formatted errors
        // NestJS will set response.message to formattedErrors
        throw new BadRequestException(formattedErrors);
      }
      throw new BadRequestException("Validation failed");
    }
  }

  /**
   * Format Zod errors to field-level error format
   * @param error - ZodError instance
   * @returns Formatted errors object
   */
  private formatZodErrors(error: ZodError): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
      // Handle root-level errors (empty path) and nested errors
      const field = issue.path.length > 0 ? issue.path.join(".") : "root";
      let message = issue.message;

      // Replace generic Zod error messages with user-friendly ones
      if (message.includes("expected string, received undefined")) {
        // Field is missing/required
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        message = `${fieldName} is required`;
      } else if (message.includes("expected string, received null")) {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        message = `${fieldName} is required`;
      } else if (message.includes("Invalid input")) {
        // Try to extract a better message or use a generic one
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (message.includes("received undefined")) {
          message = `${fieldName} is required`;
        } else {
          message = message.replace("Invalid input: ", "");
        }
      }

      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }

      // Avoid duplicate messages
      if (!formattedErrors[field].includes(message)) {
        formattedErrors[field].push(message);
      }
    });

    return formattedErrors;
  }
}
