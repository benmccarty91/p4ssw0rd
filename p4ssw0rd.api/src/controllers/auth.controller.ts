import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "src/guards/auth.guard";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "src/models/auth.model";
import { AuthService } from "src/services/auth.service";
import { Anonymous } from "src/utils/decorators/anonymous.decorator";

@UseGuards(AuthGuard)
@Controller({ path: "/auth" })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/refresh")
  @Anonymous()
  public refresh(
    @Body() body: RefreshTokenRequest
  ): Observable<RefreshTokenResponse> {
    return this.authService.refreshToken(body.refreshToken);
  }
}
