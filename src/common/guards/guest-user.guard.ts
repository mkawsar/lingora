import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { User } from "@/modules/users/entities/user.entity";

/**
 * Guest User Guard
 * Restricts access to guest users only
 * Requires JwtAuthGuard to be applied first
 */
@Injectable()
export class GuestUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required");
    }

    if (!user.isGuest) {
      throw new ForbiddenException(
        "This action is only available for guest users",
      );
    }

    return true;
  }
}
