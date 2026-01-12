import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "@/modules/users/entities/user.entity";
import { UserRepository } from "@/modules/users/repositories/user.repository";
import { JwtStrategy } from "./strategies/jwt.strategy";
import jwtConfig from "@/config/jwt.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>("jwt.secret");
        const expiresIn = configService.get<string>("jwt.expiresIn") || "7d";
        return {
          secret: secret || "your-secret-key",
          signOptions: {
            expiresIn: expiresIn as any, // StringValue type from ms package
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
