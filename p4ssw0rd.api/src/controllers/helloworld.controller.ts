import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { Anonymous } from 'src/utils/decorators/anonymous.decorator';
import { HelloWorldService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller()
export class HelloWorldController {
  constructor(private appService: HelloWorldService, private config: ConfigService) {}

  @Get()
  @Anonymous()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/authorized')
  getAuthorized(): string {
    return this.appService.getHello();
  }
}
