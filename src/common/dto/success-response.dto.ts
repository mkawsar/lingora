import { ApiProperty } from "@nestjs/swagger";

/**
 * Standard success response DTO for Swagger documentation
 */
export class SuccessResponseDto<T = any> {
  @ApiProperty({
    example: true,
    description: "Indicates if the request was successful",
  })
  success: true;

  @ApiProperty({ example: 200, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    example: ["Operation successful"],
    description: "Success message(s)",
    type: [String],
  })
  message: string[];

  @ApiProperty({ description: "Response data", required: false })
  data?: T;

  @ApiProperty({
    example: "2024-01-12T10:00:00.000Z",
    description: "Response timestamp",
  })
  timestamp: string;
}
