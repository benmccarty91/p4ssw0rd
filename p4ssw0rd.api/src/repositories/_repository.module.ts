import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/_admin.module';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  imports: [AdminModule]
})
export class RepositoryModule {}
