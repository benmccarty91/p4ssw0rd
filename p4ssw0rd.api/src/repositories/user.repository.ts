import { Injectable, Scope } from "@nestjs/common";
import { User } from "src/models/user.model";
import { FirebaseAdmin } from "../admin/firebase.admin";

@Injectable({ scope: Scope.DEFAULT })
export class UserRepository {
  private db: FirebaseFirestore.Firestore;
  constructor(admin: FirebaseAdmin) {
    this.db = admin.Database;
  }

  public async saveUser(user: User): Promise<boolean> {
    try {
      await this.db.collection("users").doc(user.userId).set(user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async getUser(userId: string): Promise<User> {
    const userRef = await this.db.collection("users").doc(userId).get();
    return userRef.data() as User;
  }
}
