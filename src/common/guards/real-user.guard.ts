import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { User } from "@/modules/users/entities/user.entity";

/**
 * Real User Guard
 * Restricts access to authenticated real users only (not guest users)
 * Requires JwtAuthGuard to be applied first
 */
@Injectable()
export class RealUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required");
    }

    if (user.isGuest) {
      throw new ForbiddenException(
        "This action is not available for guest users",
      );
    }

    return true;
  }
}
