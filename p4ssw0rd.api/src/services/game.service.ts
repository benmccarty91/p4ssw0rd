import { Injectable, Scope } from "@nestjs/common";
import { from, map, Observable } from "rxjs";
import { GameRepository } from "src/repositories/game.repository";
import { UserService } from "./user.service";
import * as crypto from "crypto";
import { Game, GameStatus } from "src/models/game.model";

@Injectable({ scope: Scope.DEFAULT })
export class GameService {
  constructor(
    private gameRepo: GameRepository,
    private userService: UserService
  ) {}

  public newGame(forceCreate: boolean = false): Observable<boolean> {
    const gameId = crypto.randomUUID();
    const userId = this.userService.userId;
    return from(
      this.gameRepo.newGame(
        {
          id: gameId,
          ownerId: userId,
          gameStatus: GameStatus.NOT_STARTED,
        },
        forceCreate
      )
    );
  }

  public getGame(): Observable<Game | undefined> {
    const userId = this.userService.userId;
    return from(this.gameRepo.getGame(userId)).pipe(
      map((game) => (game ? game : undefined))
    );
  }
}
