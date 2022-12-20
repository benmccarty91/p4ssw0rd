import { IsNotEmpty, IsString, NotContains } from "class-validator";

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  @NotContains('null')
  @NotContains('undefined')
  refreshToken: string;
}

export interface RefreshTokenResponse {
  authToken: string;
  authTokenExpiration: string;
  refreshToken: string;
  userId: string;
}
