import { Injectable, Scope } from "@nestjs/common";
import { catchError, from, map, Observable, throwError } from "rxjs";
import { auth } from "firebase-admin";
import { FirebaseAdmin } from "../admin/firebase.admin";
import { RefreshTokenResponse } from "src/models/auth.model";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import * as moment from "moment";

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    private firebaseAdmin: FirebaseAdmin,
    private httpService: HttpService,
    private config: ConfigService
  ) {}

  public validateToken(token: string): Observable<auth.DecodedIdToken> {
    return from(this.firebaseAdmin.Auth.verifyIdToken(token, true));
  }

  public refreshToken(token: string): Observable<RefreshTokenResponse> {
    return this.httpService
      .post(
        `https://securetoken.googleapis.com/v1/token?key=${this.config.get(
          "GOOGLE_API_KEY"
        )}`,
        {
          grant_type: "refresh_token",
          refresh_token: token,
        }
      )
      .pipe(
        map((res) => ({
          authToken: res.data.access_token,
          authTokenExpiration: moment().add(res.data.expires_in, "s").format(),
          refreshToken: token,
          userId: res.data.user_id,
        })),
        catchError((err) => {
          console.error(
            `Axios error: ${JSON.stringify(err.response?.data?.error || err)}`
          );
          return throwError(() => err);
        })
      );
  }
}
