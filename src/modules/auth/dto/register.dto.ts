import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "User email address (must be unique)",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "User profile photo URL",
    example: "https://example.com/photo.jpg",
  })
  @IsOptional()
  @IsString()
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
