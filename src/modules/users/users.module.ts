import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@/modules/users/entities/user.entity";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { UsersController } from "@/modules/users/users.controller";
import { UsersService } from "@/modules/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository], // Export for use in other modules
})
export class UsersModule {}
