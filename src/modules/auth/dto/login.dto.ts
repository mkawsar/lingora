import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
  })
  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password: string;
}
