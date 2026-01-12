import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { successResponse } from "@/common/utils/response.util";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new user",
    description: "Creates a new user with auto-generated UUID",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "User successfully created",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService
      .create(createUserDto)
      .then((user) =>
        successResponse(user, "User created successfully", HttpStatus.CREATED),
      );
  }

  @Get()
  @ApiOperation({
    summary: "Get all users",
    description: "Returns a list of all users",
  })
  @ApiResponse({
    status: 200,
    description: "List of users retrieved successfully",
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService
      .findAll()
      .then((users) => successResponse(users, "Users retrieved successfully"));
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get user by ID",
    description: "Returns a single user by UUID",
  })
  @ApiParam({
    name: "id",
    description: "User UUID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService
      .findOne(id)
      .then((user) => successResponse(user, "User retrieved successfully"));
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update user",
    description: "Updates user information by UUID",
  })
  @ApiParam({
    name: "id",
    description: "User UUID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService
      .update(id, updateUserDto)
      .then((user) => successResponse(user, "User updated successfully"));
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete user",
    description: "Deletes a user by UUID",
  })
  @ApiParam({
    name: "id",
    description: "User UUID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({ status: 204, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Get("profile/me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user profile",
    description:
      "Returns the authenticated user's profile (requires JWT token)",
  })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - invalid or missing token",
  })
  getProfile(@Request() req: { user: UserResponseDto }) {
    return successResponse(req.user, "Profile retrieved successfully");
  }
}
