import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "../admin/_admin.module";
import { RepositoryModule } from "../repositories/_repository.module";
import { HelloWorldService } from "./app.service";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

@Module({
  providers: [HelloWorldService, AuthService, UserService],
  exports: [HelloWorldService, AuthService, UserService],
  imports: [AdminModule, RepositoryModule, HttpModule, ConfigModule],
})
export class ServiceModule {}
