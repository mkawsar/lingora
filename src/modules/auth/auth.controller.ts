import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UserResponseDto } from "@/modules/users/dto/user-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register a new user",
    description:
      "Register a new user. Set isGuest to true to register as a guest user.",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("register/guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register a guest user",
    description:
      "Register a new guest user. isGuest will be automatically set to true.",
  })
  @ApiBody({
    type: RegisterDto,
    description: "Registration data (isGuest will be ignored and set to true)",
  })
  @ApiResponse({
    status: 201,
    description: "Guest user successfully registered",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  async registerGuest(@Body() registerDto: Omit<RegisterDto, "isGuest">) {
    return this.authService.registerGuest(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login user",
    description: "Authenticate user with email and password",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - invalid credentials",
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
