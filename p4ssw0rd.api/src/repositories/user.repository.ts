import { Injectable, Scope } from "@nestjs/common";
import { FirebaseAdmin } from "../admin/firebase.admin";

@Injectable({ scope: Scope.DEFAULT })
export class UserRepository {
  private database: FirebaseFirestore.Firestore;
  constructor(admin: FirebaseAdmin) {
    this.database = admin.Database
  }
}
