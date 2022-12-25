import { Injectable, Scope } from "@nestjs/common";
import { catchError, from, map, Observable, switchMap, throwError } from "rxjs";
import { Game, playerFromUser } from "src/models/game.model";
import { GameRepository } from "src/repositories/game.repository";
import { UserService } from "./user.service";

@Injectable({ scope: Scope.DEFAULT })
export class TeamService {
  constructor(
    private gameRepo: GameRepository,
    private userService: UserService
  ) {}

  public randomizeTeams(gameId: string): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        for (let i = 0; i < game.teams.length; i++) {
          this.movePlayersIntoStaged(i + 1, game);
        }
        const staged = game.stagedPlayers;
        staged.sort(() => Math.random() - 0.5);
        const numPlayersPerTeam = Math.ceil(staged.length / game.teams.length);
        let i = 0;
        while (staged.length > 0) {
          game.teams[i].players = staged.splice(0, numPlayersPerTeam);
          i++;
        }
        return this.gameRepo.saveGame(game);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  public joinTeam(gameId: string, teamNumber: number): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        const team = game.teams[teamNumber - 1];
        return this.userService.getUser().pipe(
          switchMap((user) => {
            team.players.push(playerFromUser(user));
            const index = game.stagedPlayers.findIndex(
              (el) => el.userId === user.userId
            );
            if (index >= 0) {
              game.stagedPlayers.splice(index, 1);
            } else {
              // TODO: If player is not in staged, then they are already in a team
              // TODO: I need a method to find what team the player is on
            }
            return this.gameRepo.saveGame(game);
          })
        );
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  public addTeam(gameId: string): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        game.teams.push({ players: [], score: 0 });
        return this.gameRepo.saveGame(game);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  public deleteTeam(gameId: string, teamId: number): Observable<boolean> {
    return from(this.gameRepo.getGame(gameId)).pipe(
      switchMap((game) => {
        this.movePlayersIntoStaged(teamId, game);
        game.teams.splice(teamId - 1, 1);
        return this.gameRepo.saveGame(game);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  private movePlayersIntoStaged(teamNumber: number, game: Game): void {
    const team = game.teams[teamNumber - 1];
    game.stagedPlayers = game.stagedPlayers.concat(team.players);
    team.players = [];
    game.teams[teamNumber - 1] = team;
  }
}
