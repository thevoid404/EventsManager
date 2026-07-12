import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY } from '../constants';

/**
 * Allows unauthenticated access while attaching `request.user` when a valid JWT is present.
 * Use on public routes that return user-specific fields (e.g. isInterested on events).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch {
      return true;
    }
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | null {
    if (err || !user) {
      return null;
    }

    return user;
  }
}
