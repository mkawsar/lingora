import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { BaseRepository } from "@/common/repositories/base.repository";

/**
 * User repository extending BaseRepository
 * Provides common CRUD operations plus user-specific methods
 */
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ where: { email } });
  }

  /**
   * Find users by admin status
   * @param isAdmin - Admin status
   * @returns Array of users
   */
  async findByAdminStatus(isAdmin: boolean): Promise<User[]> {
    return this.findAll({ where: { isAdmin } });
  }

  /**
   * Find users by guest status
   * @param isGuest - Guest status
   * @returns Array of users
   */
  async findByGuestStatus(isGuest: boolean): Promise<User[]> {
    return this.findAll({ where: { isGuest } });
  }

  /**
   * Check if email exists
   * @param email - User email
   * @returns true if email exists, false otherwise
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.getRepository().count({ where: { email } });
    return count > 0;
  }
}
