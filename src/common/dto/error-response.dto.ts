import { ApiProperty } from "@nestjs/swagger";

/**
 * Standard error response DTO for Swagger documentation
 */
export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: "Indicates if the request was successful",
  })
  success: false;

  @ApiProperty({ example: 400, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    example: {
      name: ["Name is required"],
      email: ["Email is required", "Email must be a valid email address"],
      password: [
        "Password is required",
        "Password must be at least 6 characters long",
      ],
    },
    description:
      "Error message(s) - can be an array of strings or an object with field names as keys and error messages as arrays",
    oneOf: [
      { type: "array", items: { type: "string" } },
      {
        type: "object",
        additionalProperties: { type: "array", items: { type: "string" } },
      },
    ],
  })
  message: string[] | Record<string, string[]>;

  @ApiProperty({ example: "Bad Request", description: "Error type/name" })
  error: string;

  @ApiProperty({
    example: "2024-01-12T10:00:00.000Z",
    description: "Response timestamp",
  })
  timestamp: string;
}
