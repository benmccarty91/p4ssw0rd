import {
  Controller,
  Get,
  InternalServerErrorException,
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
    return this.gameService.getGame().pipe(
      map((game) => {
        if (!game) {
          return {};
        } else {
          return game;
        }
      })
    );
  }
}
