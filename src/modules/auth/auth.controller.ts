import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards";
import { CurrentUser } from "@/common/decorators/user.decorator";
import { User } from "@/modules/users/entities/user.entity";

import { AuthService } from "./auth.service";
import { RegisterDto, RegisterSchema } from "./schemas/register.schema";
import { LoginDto, LoginSchema } from "./schemas/login.schema";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UserResponseDto } from "@/modules/users/dto/user-response.dto";
import { successResponse } from "@/common/utils/response.util";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterSchema))
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
    const user = await this.authService.register(registerDto);
    return successResponse(
      user,
      "User registered successfully",
      HttpStatus.CREATED,
    );
  }

  @Post("register/guest")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterSchema))
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
    const user = await this.authService.registerGuest(registerDto);
    return successResponse(
      user,
      "Guest user registered successfully",
      HttpStatus.CREATED,
    );
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginSchema))
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
    const result = await this.authService.login(loginDto);
    return successResponse(result, "Login successful", HttpStatus.OK);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user profile",
    description: "Get the authenticated user's profile data",
  })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - invalid or missing token",
  })
  getProfile(@CurrentUser() user: User) {
    const { password: _password, ...userWithoutPassword } = user;
    return successResponse(
      userWithoutPassword,
      "Profile retrieved successfully",
      HttpStatus.OK,
    );
  }
}
