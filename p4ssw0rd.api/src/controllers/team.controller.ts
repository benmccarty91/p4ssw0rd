import {
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AuthGuard } from "src/guards/auth.guard";
import { TeamService } from "src/services/team.service";

@UseGuards(AuthGuard)
@Controller({ path: "game/:gameId/team" })
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post("/")
  public create(@Param() params: { gameId: string }): Observable<void> {
    return this.teamService.addTeam(params.gameId).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
      })
    );
  }

  @Post("/randomize")
  public randomize(@Param() params: { gameId: string }): Observable<void> {
    return this.teamService.randomizeTeams(params.gameId).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
      })
    );
  }

  @Post("/join/:teamNumber")
  public join(
    @Param() params: { gameId: string; teamNumber: number }
  ): Observable<void> {
    return this.teamService.joinTeam(params.gameId, params.teamNumber).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
      })
    );
  }

  @Delete("/:teamNumber")
  public delete(@Param() params: { gameId: string; teamNumber: number }) {
    return this.teamService.deleteTeam(params.gameId, params.teamNumber).pipe(
      map((res) => {
        if (!res) {
          throw new InternalServerErrorException();
        }
      })
    );
  }
}
