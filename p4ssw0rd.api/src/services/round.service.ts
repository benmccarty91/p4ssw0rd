import { Injectable, Scope } from "@nestjs/common";
import { Round } from "src/models/game.model";
import { GameRepository } from "src/repositories/game.repository";
import * as crypto from "crypto";
import { from, Observable, switchMap } from "rxjs";
import { WordPoolService } from "./wordPool.service";

@Injectable({ scope: Scope.DEFAULT })
export class RoundService {
  constructor(
    private gameRepo: GameRepository,
    private wordPoolService: WordPoolService
  ) {}

  public startRound(gameId: string, category: string): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        const playerOrder = game.teams
          .map((t) => t.players)
          .flat()
          .sort(() => Math.random() - 0.5);
        return this.wordPoolService
          .getWordPool(category, game.spentWords[category])
          .pipe(
            switchMap((pool) => {
              const newRound: Round = {
                roundId: crypto.randomUUID(),
                players: playerOrder,
                timer: 90,
                category: category,
                wordPool: pool.words,
              };
              return this.gameRepo.saveRound(gameId, newRound);
            })
          );
      })
    );
  }

  public expireWord(
    gameId: string,
    category: string,
    word: string
  ): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        if (!game.spentWords[category]) {
          game.spentWords[category] = [];
        }
        game.spentWords[category].push(word);
        return this.gameRepo.saveGame(game);
      })
    );
  }
}
