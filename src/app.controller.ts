import { Controller, Get, Post, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Public()
  @Get('tokens')
  tokens(@Query('code') code: string) {
    return this.appService.getTokens(code)
  }

  @Get('google/refresh/access_token')
  refreshGoogleAccessToken(@Request() req:any) {
    return this.appService.getNewGoogleAccessToken(req.email)
  }
  

  
}
