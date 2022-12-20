import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthGuard } from "src/guards/auth.guard";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "src/models/auth.model";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import { Anonymous } from "src/utils/decorators/anonymous.decorator";

@UseGuards(AuthGuard)
@Controller({ path: "/auth" })
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post("/refresh")
  @Anonymous()
  public refresh(
    @Body() body: RefreshTokenRequest
  ): Observable<RefreshTokenResponse> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post("/register")
  public register(): Observable<void> {
    return this.userService.registerUser().pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
        return;
      })
    );
  }
}
