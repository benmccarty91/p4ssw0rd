import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/_admin.module';
import { ControllerModule } from './controllers/_controller.module';
import { GuardModule } from './guards/_guard.module';
import { RepositoryModule } from './repositories/_repository.module';
import { ServiceModule } from './services/_service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env'],
    }),
    ControllerModule, 
    ServiceModule, 
    RepositoryModule, 
    GuardModule,
    AdminModule
  ],
})
export class AppModule {}
