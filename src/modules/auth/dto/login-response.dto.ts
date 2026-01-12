import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "@/modules/users/dto/user-response.dto";

export class LoginResponseDto {
  @ApiProperty({
    description: "JWT access token",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE2NDIxMjM0NTYsImV4cCI6MTY0Mjc2ODI1Nn0.example",
  })
  accessToken: string;

  @ApiProperty({
    description: "User information",
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
