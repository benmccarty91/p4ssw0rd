import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Anonymous } from '../utils/decorators/anonymous.decorator';
import { HelloWorldService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller()
export class HelloWorldController {
  constructor(private appService: HelloWorldService) {}

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
