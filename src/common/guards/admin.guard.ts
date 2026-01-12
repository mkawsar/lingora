import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { User } from "@/modules/users/entities/user.entity";

/**
 * Admin Guard
 * Restricts access to admin users only
 * Requires JwtAuthGuard to be applied first
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required");
    }

    if (!user.isAdmin) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
