import { Injectable, Scope } from "@nestjs/common";
import { User } from "src/models/user.model";
import { FirebaseAdmin } from "../admin/firebase.admin";

@Injectable({ scope: Scope.DEFAULT })
export class UserRepository {
  private db: FirebaseFirestore.Firestore;
  constructor(admin: FirebaseAdmin) {
    this.db = admin.Database;
  }

  public newUser(user: User): Promise<boolean> {
    return this.db
      .collection("users")
      .doc(user.userId)
      .set(user)
      .then((x) => true)
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
