import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @ApiProperty({
    description: "User email address (must be unique)",
    example: "john.doe@example.com",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @ApiPropertyOptional({
    description: "User profile photo URL",
    example: "https://example.com/photo.jpg",
  })
  @IsOptional()
  @IsString({ message: "Photo must be a string" })
  photo?: string;

  @ApiPropertyOptional({
    description: "Register as guest user",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isGuest?: boolean;
}
