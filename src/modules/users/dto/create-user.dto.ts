import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
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
}
