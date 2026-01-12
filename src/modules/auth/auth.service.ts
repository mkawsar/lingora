import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

import { UserRepository } from "@/modules/users/repositories/user.repository";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "@/modules/users/entities/user.entity";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user (regular or guest)
   * @param registerDto - Registration data
   * @returns Created user (without password)
   */
  async register(registerDto: RegisterDto): Promise<Omit<User, "password">> {
    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(
      registerDto.email,
    );
    if (emailExists) {
      throw new ConflictException(
        `User with email ${registerDto.email} already exists`,
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with hashed password
    const user = await this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      isGuest: registerDto.isGuest ?? false, // Default to false if not provided
    });

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Register a guest user
   * @param registerDto - Registration data (isGuest will be set to true)
   * @returns Created guest user (without password)
   */
  async registerGuest(
    registerDto: Omit<RegisterDto, "isGuest">,
  ): Promise<Omit<User, "password">> {
    return this.register({
      ...registerDto,
      isGuest: true,
    });
  }

  /**
   * Validate user credentials
   * @param loginDto - Login credentials
   * @returns User if credentials are valid (without password)
   */
  async validateUser(loginDto: LoginDto): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login user and generate JWT token
   * @param loginDto - Login credentials
   * @returns JWT token and user information
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      isGuest: user.isGuest,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  /**
   * Validate user by ID (for JWT strategy)
   * @param userId - User ID from JWT payload
   * @returns User if found
   */
  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne(userId);
  }
}
