import { Module } from "@nestjs/common";
import { AdminModule } from "../admin/_admin.module";
import { GameRepository } from "./game.repository";
import { UserRepository } from "./user.repository";
import { WordPoolRepository } from "./wordPool.repository";

@Module({
  providers: [UserRepository, GameRepository, WordPoolRepository],
  exports: [UserRepository, GameRepository, WordPoolRepository],
  imports: [AdminModule],
})
export class RepositoryModule {}
