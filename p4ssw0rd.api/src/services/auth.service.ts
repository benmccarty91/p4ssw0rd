import { Injectable, Scope } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { auth } from "firebase-admin";
import { FirebaseAdmin } from "src/admin/firebase.admin";

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    private firebaseAdmin: FirebaseAdmin,
  ) { }

  public validateToken(token: string): Observable<auth.DecodedIdToken> {
    return from(this.firebaseAdmin.Auth.verifyIdToken(token, true));
  }
}
