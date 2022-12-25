import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GuardModule } from "../guards/_guard.module";
import { ServiceModule } from "../services/_service.module";
import { AuthController } from "./auth.controller";
import { GameController } from "./game.controller";
import { HelloWorldController } from "./helloworld.controller";
import { TeamController } from "./team.controller";

@Module({
  controllers: [
    HelloWorldController,
    AuthController,
    GameController,
    TeamController,
  ],
  exports: [],
  imports: [ServiceModule, GuardModule, ConfigModule],
})
export class ControllerModule {}
