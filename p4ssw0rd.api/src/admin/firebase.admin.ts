import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";


@Injectable({ scope: Scope.DEFAULT })
export class FirebaseAdmin {
  private _app: admin.app.App;
  private _db: FirebaseFirestore.Firestore;
  private _auth: admin.auth.Auth;

  constructor(config: ConfigService) {
    this._app = admin.initializeApp({
      projectId: config.get('PROJECT_ID'),
    });
    this._db = admin.firestore(this._app);
    this._db.settings({ ignoreUndefinedProperties: true });
    this._auth = admin.auth(this._app);
  }

  public get Auth(): admin.auth.Auth {
    return this._auth;
  }

  public get Database(): FirebaseFirestore.Firestore {
    return this._db;
  }
}