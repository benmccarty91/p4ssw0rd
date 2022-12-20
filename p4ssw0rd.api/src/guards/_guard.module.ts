import { Module } from '@nestjs/common';
import { ServiceModule } from '../services/_service.module';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
  imports: [ServiceModule],
})
export class GuardModule {}
