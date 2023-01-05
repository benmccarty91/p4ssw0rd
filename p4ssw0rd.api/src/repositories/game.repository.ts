import { Injectable, Scope } from "@nestjs/common";
import { FirebaseAdmin } from "src/admin/firebase.admin";
import { ActiveGameAlreadyExistsError } from "src/models/exceptions.model";
import { Game, Round } from "src/models/game.model";
import { User } from "src/models/user.model";

@Injectable({ scope: Scope.DEFAULT })
export class GameRepository {
  private db: FirebaseFirestore.Firestore;
  constructor(admin: FirebaseAdmin) {
    this.db = admin.Database;
  }

  public async newGame(
    game: Game,
    overwriteExistingGame: boolean = false
  ): Promise<boolean> {
    const gameRef = this.db.collection("games").doc(game.id);
    const userRef = this.db.collection("users").doc(game.ownerId);
    const userDoc = await userRef.get();
    const user = userDoc.data() as User;
    if (user.activeGameId && !overwriteExistingGame) {
      throw new ActiveGameAlreadyExistsError("User already has an active game");
    }
    try {
      await userRef.update({ activeGameId: game.id });
      await gameRef.set(game);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async getUsersGame(userId: string): Promise<Game | false> {
    const userDoc = await this.db.collection("users").doc(userId).get();
    const user = userDoc.data() as User;
    if (!user.activeGameId) {
      return false;
    }
    try {
      const gameDoc = await this.db
        .collection("games")
        .doc(user.activeGameId)
        .get();
      return gameDoc.data() as Game;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async getGame(gameId: string): Promise<Game> {
    const gameRef = await this.db.collection("games").doc(gameId).get();
    return gameRef.data() as Game;
  }

  public async saveGame(game: Game): Promise<boolean> {
    try {
      await this.db.collection("games").doc(game.id).set(game);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async saveRound(gameId: string, round: Round): Promise<boolean> {
    try {
      await this.db
        .collection("games")
        .doc(gameId)
        .collection("rounds")
        .doc(round.roundId)
        .set(round);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async getRound(
    gameId: string,
    roundId: string
  ): Promise<Round | false> {
    try {
      const doc = await this.db
        .collection("games")
        .doc(gameId)
        .collection("rounds")
        .doc(roundId)
        .get();
      return doc.data() as Round;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
