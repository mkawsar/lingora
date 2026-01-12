import { z } from "zod";
import { createZodDto } from "nestjs-zod";

/**
 * Zod schema for user registration
 */
export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .trim(),
});

/**
 * DTO class generated from Zod schema
 * This can be used with Swagger and provides TypeScript types
 */
export class RegisterDto extends createZodDto(RegisterSchema) {}
