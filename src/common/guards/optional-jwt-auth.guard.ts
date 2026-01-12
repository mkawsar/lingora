import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";

/**
 * Optional JWT Auth Guard
 * Allows requests with or without authentication
 * If token is present and valid, user is attached to request
 * If token is missing or invalid, request continues without user
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const result = super.canActivate(context);

    // Handle different return types
    if (result instanceof Promise) {
      return result.catch(() => true);
    }

    if (result instanceof Observable) {
      return result.pipe(
        map((value) => value),
        catchError(() => of(true)),
      );
    }

    // If it's a boolean, return it
    return result;
  }

  handleRequest(err: any, user: any) {
    // Return user if authenticated, or undefined if not
    // This allows the route to check if user exists
    return user || undefined;
  }
}
