import { Injectable, Scope } from "@nestjs/common";
import { FirebaseAdmin } from "src/admin/firebase.admin";
import { WordPool } from "src/models/word.model";

@Injectable({ scope: Scope.DEFAULT })
export class WordPoolRepository {
  private db: FirebaseFirestore.Firestore;
  constructor(admin: FirebaseAdmin) {
    this.db = admin.Database;
  }

  public async getCategories(): Promise<string[] | false> {
    try {
      const query = await this.db.collection("wordPool").get();
      const categories = query.docs.map((d) => d.id);
      return categories;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async getWordPool(category: string): Promise<WordPool | false> {
    try {
      const query = await this.db.collection("wordPool").doc(category).get();
      const pool = query.data() as WordPool;
      return pool;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
