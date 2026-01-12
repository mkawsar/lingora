import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "User UUID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiPropertyOptional({
    description: "User profile photo URL",
    example: "https://example.com/photo.jpg",
  })
  photo?: string;

  @ApiProperty({
    description: "Is guest user",
    example: false,
    default: false,
  })
  isGuest: boolean;

  @ApiProperty({
    description: "Is admin user",
    example: false,
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: "Account creation timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  updatedAt: Date;
}
