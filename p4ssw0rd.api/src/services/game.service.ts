import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
import { from, map, Observable, switchMap } from "rxjs";
import { GameRepository } from "src/repositories/game.repository";
import { UserService } from "./user.service";
import * as crypto from "crypto";
import { Game, GameStatus, playerFromUser } from "src/models/game.model";
import { ActiveGameAlreadyExistsError } from "src/models/exceptions.model";

@Injectable({ scope: Scope.DEFAULT })
export class GameService {
  constructor(
    private gameRepo: GameRepository,
    private userService: UserService
  ) {}

  public newGame(forceCreate: boolean = false): Observable<boolean> {
    const gameId = crypto.randomUUID();
    const userId = this.userService.userId;
    return this.userService.getUser().pipe(
      switchMap((user) =>
        this.gameRepo.newGame(
          {
            id: gameId,
            ownerId: userId,
            gameStatus: GameStatus.NOT_STARTED,
            rounds: [],
            teams: [{ players: [playerFromUser(user)], score: 0 }],
            stagedPlayers: [],
          },
          forceCreate
        )
      )
    );
  }

  public joinGame(
    gameId: string,
    forceJoin: boolean = false
  ): Observable<boolean> {
    return from(this.userService.getUser()).pipe(
      map((res) => {
        if (res.activeGameId && !forceJoin) {
          throw new ActiveGameAlreadyExistsError(
            "Cannot join game because user is already in a game"
          );
        }
        return res;
      }),
      switchMap((user) => {
        user.activeGameId = gameId;
        return this.userService.saveUser(user).pipe(
          map((res) => {
            if (res) {
              return user;
            } else {
              throw new InternalServerErrorException(
                "failed to save active game Id"
              );
            }
          })
        );
      }),
      switchMap((user) => {
        return from(this.gameRepo.getGame(gameId)).pipe(
          switchMap((game) => {
            game.stagedPlayers.push(playerFromUser(user));
            return this.gameRepo.saveGame(game);
          })
        );
      })
    );
  }

  public getUsersGame(): Observable<Game | undefined> {
    const userId = this.userService.userId;
    return from(this.gameRepo.getUsersGame(userId)).pipe(
      map((game) => (game ? game : undefined))
    );
  }
}
