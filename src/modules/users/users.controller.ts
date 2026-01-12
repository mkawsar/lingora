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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Creates a new user with auto-generated UUID
   * 
   * Example request body:
   * {
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "password": "password123",
   *   "photo": "https://example.com/photo.jpg"
   * }
   * 
   * Example response:
   * {
   *   "id": "550e8400-e29b-41d4-a716-446655440000",  // Auto-generated UUID
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "photo": "https://example.com/photo.jpg",
   *   "isGuest": false,
   *   "isAdmin": false,
   *   "createdAt": "2024-01-15T10:30:00Z",
   *   "updatedAt": "2024-01-15T10:30:00Z"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Returns all users with their UUIDs
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Find user by UUID
   * 
   * Example: GET /users/550e8400-e29b-41d4-a716-446655440000
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Update user by UUID
   * 
   * Example: PATCH /users/550e8400-e29b-41d4-a716-446655440000
   * Body: { "name": "Jane Doe" }
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Delete user by UUID
   * 
   * Example: DELETE /users/550e8400-e29b-41d4-a716-446655440000
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
