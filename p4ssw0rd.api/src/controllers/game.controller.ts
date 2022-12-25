import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthGuard } from "src/guards/auth.guard";
import { Game } from "src/models/game.model";
import { GameService } from "src/services/game.service";

@UseGuards(AuthGuard)
@Controller({ path: "/game" })
export class GameController {
  constructor(private gameService: GameService) {}

  @Post("/")
  public new(@Query() query): Observable<void> {
    const forceCreate = query?.force === "true";
    return this.gameService.newGame(forceCreate).pipe(
      map((res: boolean) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
      })
    );
  }

  @Get("/")
  public get(): Observable<Game | object> {
    return this.gameService.getUsersGame().pipe(
      map((game) => {
        if (!game) {
          return {};
        } else {
          return game;
        }
      })
    );
  }

  @Post("/join/:id")
  public join(@Param() params: { id: string }): Observable<void> {
    const gameId = params.id;
    return this.gameService.joinGame(gameId).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException("Failed to join game");
        }
        return;
      })
    );
  }
}
