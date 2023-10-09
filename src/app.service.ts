import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import FetchService from './fetch/fetch.service';
import { Result } from './interfaces';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker'
@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private fetchService: FetchService,
    private prismaService: PrismaService
  ) { }
  async fun(data: Prisma.UserCreateInput) {
    this.prismaService.user.create({ data })
  }
  async getTokens(code: string) {
    let result: Result<{
      google_access_token: string;
      token: string;
    }> = {
      errorMessage: '',
      statusCode: 400
    }
    const googleTokens = await this.fetchService.getGoogleTokens(code)
    if (googleTokens.result) {
      const profile = await this.fetchService.getUserProfile(googleTokens.result.access_token)
      if (profile.result) {

        //save email and refresh token or update refresh token if email exist
        await this.createOrUpdateUser(profile.result.email, googleTokens.result.refresh_token)
        result.statusCode = profile.statusCode
        const token = await this.jwtService.signAsync({
          google_access_token: googleTokens.result.access_token,
          email: profile.result.email
        })
        result.result = { token, google_access_token: googleTokens.result.access_token }
        result.statusCode = 200
      } else {
        result = { ...result, ...profile as any, errorMessage: "cannot fetch profile" }
      }
    } else {
      result = { ...result, ...googleTokens as any, errorMessage: "cannot fetch getGoogleTokens" }
    }
    return result
  }
  async getNewGoogleAccessToken(email: string) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where:{
        email
      }
    })
    let result: Result<{
      google_access_token: string;
    }> | Result<undefined> = {
      errorMessage: '',
      statusCode: 400
    }
    const tokenResult = await this.fetchService.getNewGoogleAccessToken(user.refreshToken)
    if (tokenResult.result) {
      await this.createOrUpdateUser(email, tokenResult.result.access_token)
      result.result = {
        google_access_token: tokenResult.result.access_token
      }
      result.statusCode = 200
    } else {
      result = { ...result, ...tokenResult as any, errorMessage: "cannot fetch getNewGoogleAccessToken" }
    }
    return result
  }
  createOrUpdateUser(email: string, refreshToken: string) {
    return this.prismaService.user.upsert({
      create: {
        email: email,
        refreshToken: refreshToken
      },
      update: {
        email: email,
        refreshToken: refreshToken
      },
      where: {
        email: email
      }
    })
  }
}
