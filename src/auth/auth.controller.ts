import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { GoogleAuthGuard } from '@auth/guards/google-auth.guard';
import { KakaoAuthGuard } from '@auth/guards/kakao-auth.guard';
import { NaverAuthGuard } from '@auth/guards/naver-auth.guard';
import { EmailDto } from '@user/dto/email.dto';
import { ChangePasswordDto } from '@user/dto/change-password.dto';
import { UserService } from '@user/user.service';
import { RefreshTokenGuard } from '@auth/guards/refreshToken.guard';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 유저 회원가입
  @Post('/signup')
  async signupUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    await this.authService.welcomeSignupMail(user.email);

    return user;
  }

  // 유저 로그인(email)
  // @Post('/login')
  // async loggedInUser(@Body() loginUserDto: LoginUserDto) {
  //   const user = await this.authService.loginUser(loginUserDto);
  //   const accessToken = await this.authService.generateAccessToken(user.id);
  //
  //   return { user, token: accessToken };
  // }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async loggedInUser(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const { user } = req;
    const { token: accessToken, cookie: accessTokenCookie } =
      this.authService.generateToken(user.id, 'access');
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.generateToken(user.id, 'refresh');

    // 토큰 발급 후, refreshToken을 Redis에 저장
    await this.userService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    //
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    // return { user, accessToken, refreshToken };

    res.send({ user });
  }

  // RefreshToken API -> AccessToken을 갱신하는 용도
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refresh(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    const { token: accessToken, cookie: accessTokenCookie } =
      await this.authService.generateToken(user.id, 'access');

    req.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return req.user;
  }

  // 로그인 이후 토큰을 기반한 유저정보를 가져오는 API
  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async authenticate(@Req() req: RequestWithUserInterface) {
    return await req.user;
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: RequestWithUserInterface) {
    const { user } = await req;
    const token = await this.authService.generateToken(user.id, 'access');

    return { user, token };
  }

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const { user } = req;
    const { token: accessToken, cookie: accessTokenCookie } =
      this.authService.generateToken(user.id, 'access');
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.generateToken(user.id, 'refresh');

    // 토큰 발급 후, refreshToken을 Redis에 저장
    await this.userService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    //
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    // return { user, accessToken, refreshToken };

    res.send({ user });
  }

  @Get('/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = this.authService.generateToken(user.id, 'access');

    return { user, token };
  }

  // 이메일 확인용
  @Post('/email/send')
  async initEmailAddressVerification(@Body('email') email: string) {
    return await this.authService.sendEmailVerification(email);
  }

  @Post('/find/password')
  async findPassword(@Body() emailDto: EmailDto) {
    return await this.authService.findPasswordSendEmail(emailDto.email);
  }

  @Post('/change/password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { token, password } = changePasswordDto;
    return await this.userService.changePasswordWithToken(token, password);
  }
}
