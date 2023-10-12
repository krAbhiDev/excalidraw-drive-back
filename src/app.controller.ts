import { Controller, Get, Post, Query, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Public()
  @Get('tokens')
  async tokens(@Query('code') code: string, @Res() res: Response) {
    const result = await this.appService.getTokens(code)
    res.status(result.statusCode).send(result)
  }

  @Get('google/refresh/access_token')
  async refreshGoogleAccessToken(@Request() req: any, @Res() res: Response) {
    const result = await this.appService.getNewGoogleAccessToken(req.email)
    res.status(result.statusCode).send(result)
  }
}
