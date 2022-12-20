import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuardModule } from 'src/guards/_guard.module';
import { ServiceModule } from 'src/services/_service.module';
import { HelloWorldController } from './helloworld.controller';

@Module({
  controllers: [HelloWorldController],
  exports: [],
  imports: [ServiceModule, GuardModule, ConfigModule],
})
export class ControllerModule {}
