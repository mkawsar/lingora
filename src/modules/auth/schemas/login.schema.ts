import { z } from "zod";
import { createZodDto } from "nestjs-zod";

/**
 * Zod schema for user login
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must be a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * DTO class generated from Zod schema
 */
export class LoginDto extends createZodDto(LoginSchema) {}
