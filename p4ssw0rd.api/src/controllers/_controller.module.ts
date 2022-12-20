import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GuardModule } from "../guards/_guard.module";
import { ServiceModule } from "../services/_service.module";
import { AuthController } from "./auth.controller";
import { HelloWorldController } from "./helloworld.controller";

@Module({
  controllers: [HelloWorldController, AuthController],
  exports: [],
  imports: [ServiceModule, GuardModule, ConfigModule],
})
export class ControllerModule {}
