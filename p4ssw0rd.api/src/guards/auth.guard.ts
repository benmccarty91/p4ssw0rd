import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
    private authService: AuthService
  ) { }

  canActivate(context: ExecutionContext): Observable<boolean> {
    // allow anonymous
    const allowAnonymous = this.reflector.get<boolean>(
      "anonymous",
      context.getHandler()
    );
    if (allowAnonymous) {
      return of(true);
    }

    // get auth token
    const request = context.switchToHttp().getRequest();
    const authHeader = request?.headers?.authorization as string;
    if (!authHeader) {
      return throwError(() => new UnauthorizedException("MISSING_AUTH_TOKEN"));
    }
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return throwError(() => new UnauthorizedException("MISSING_AUTH_TOKEN"));
    }

    return this.authService.validateToken(token).pipe(
      map((decodedToken) => {
        if (!decodedToken)
          throw new UnauthorizedException("ERROR_DECODING_TOKEN");

        const userId = decodedToken.uid;
        if (!userId) throw new UnauthorizedException("NO_USER");

        this.userService.userId = userId;

        const requiredRoles = this.reflector.get<string[]>(
          "roles",
          context.getHandler()
        );
        return this.matchRoles(requiredRoles, decodedToken.claims);
      }),
      catchError((err) => {
        console.error(err);
        if (err instanceof InsufficientPermissionsError) {
          return throwError(
            () => new UnauthorizedException("INSUFFICIENT_PERMISSIONS")
          );
        }
        if (err?.errorInfo?.code === "auth/id-token-expired") {
          return throwError(() => new TokenExpiredError("TOKEN_EXPIRED"));
        }
        return throwError(() => new UnauthorizedException("TOKEN_INVALID"));
      })
    );
  }

  private matchRoles(roles: string[], claims: string[]): boolean {
    if (!roles) {
      return true;
    }
    if (!claims) {
      throw new InsufficientPermissionsError();
    }

    const intersection = roles.filter((role) => claims.includes(role));
    if (intersection.length > 0) {
      return true;
    }
    throw new InsufficientPermissionsError();
  }
}

class InsufficientPermissionsError extends Error { }
class TokenExpiredError extends UnauthorizedException { }

/**
 * expired token: eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTQzNzFiMmU4NmY4MGM1YzYxNThmNDUzYzk0NTEyNmZlNzM5Y2MiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6WyJndWVzdCJdLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWFzdGVycmF0ZXJzLWVmODI2IiwiYXVkIjoibWFzdGVycmF0ZXJzLWVmODI2IiwiYXV0aF90aW1lIjoxNjQwMjE3OTExLCJ1c2VyX2lkIjoiZmU1ZWMxNzItMjc1Yy00NjFiLWFmZWMtZjc3MGU4OWMzNmJkIiwic3ViIjoiZmU1ZWMxNzItMjc1Yy00NjFiLWFmZWMtZjc3MGU4OWMzNmJkIiwiaWF0IjoxNjQwMjE4MDEwLCJleHAiOjE2NDAyMjE2MTAsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.NFKSo8XyOuCp6Lblfhz4vR29Mu2VMAYQCDXUlt7QhFYdmcs2DsiIdKIumujTritYS96UuxiFYSYElX7sX_usXyd_QvWd4I55zoHADkCvn6VdytTCm-bWkcVKktaBSVL0ghPLZw6zVfp21PsYQRYT6V4WpqMs1Z7BW-_1AZP7ECbZleuKftza46oBfGwqG-Pzj-IbuLEJSHodKrN6y1-WOIeJwF35bbM1B0jZFt1Vb3lPezghgZAd-OvSXnhflgqrGLEc6ZGl9YVyRWP0rup6_PUJePr87p6ZyVShMlLop-D_01vXaS2kl-cEVmjJ6OAQwtZVKv7Xx-mAbt2RGMYg2Q
 */
