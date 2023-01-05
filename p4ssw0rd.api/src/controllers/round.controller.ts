import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthGuard } from "src/guards/auth.guard";
import { RoundService } from "src/services/round.service";
import { WordPoolService } from "src/services/wordPool.service";

@UseGuards(AuthGuard)
@Controller({ path: "/game/:gameId/round" })
export class RoundController {
  constructor(
    private roundService: RoundService,
    private wordPoolService: WordPoolService
  ) {}

  @Post("/start")
  public start(
    @Param() params: { gameId: string },
    @Body() body: { category: string }
  ): Observable<void> {
    return this.roundService.startRound(params.gameId, body.category).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException("Failed to start a new round");
        }
        // TODO: start the timer?
        return;
      })
    );
  }

  @Get("/categories")
  public getCategories(): Observable<string[]> {
    return this.wordPoolService.getCategories();
  }

  @Post("/expireWord")
  public expireWord(
    @Param() params: { gameId: string },
    @Body() body: { category: string; word: string }
  ): Observable<void> {
    return this.roundService
      .expireWord(params.gameId, body.category, body.word)
      .pipe(
        map((x) => {
          if (!x) {
            throw new InternalServerErrorException(
              `Failed to expire word ${body.category}|${body.word} for game: ${params.gameId}`
            );
          }
          return;
        })
      );
  }
}
