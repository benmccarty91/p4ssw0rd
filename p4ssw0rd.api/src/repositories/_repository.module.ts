import { Module } from "@nestjs/common";
import { AdminModule } from "../admin/_admin.module";
import { GameRepository } from "./game.repository";
import { UserRepository } from "./user.repository";

@Module({
  providers: [UserRepository, GameRepository],
  exports: [UserRepository, GameRepository],
  imports: [AdminModule],
})
export class RepositoryModule {}
