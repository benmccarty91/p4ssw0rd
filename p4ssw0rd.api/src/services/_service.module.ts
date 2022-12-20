import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/_admin.module';
import { RepositoryModule } from 'src/repositories/_repository.module';
import { HelloWorldService } from './app.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Module({
  providers: [HelloWorldService, AuthService, UserService],
  exports: [HelloWorldService, AuthService, UserService],
  imports: [AdminModule, RepositoryModule]
})
export class ServiceModule {}
