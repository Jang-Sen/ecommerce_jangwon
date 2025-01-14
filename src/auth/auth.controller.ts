import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { Response } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { EmailValificationDto } from '@user/dto/email-valification.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 유저 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiBody({ type: CreateUserDto })
  async signupUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    // await this.authService.welcomeSignupMail(user.email);

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

  // @Version('2')
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인 API' })
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

    res.send({ user, accessToken });
  }

  // RefreshToken API -> AccessToken을 갱신하는 용도
  @Get('/refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh Token API',
    description: 'Access Token 갱신 용도',
  })
  async refresh(@Req() req: RequestWithUserInterface, @Res() res: Response) {
    const { user } = req;
    const { token: accessToken, cookie: accessTokenCookie } =
      this.authService.generateToken(user.id, 'access');

    res.setHeader('Set-Cookie', [accessTokenCookie]);

    res.send({ user });
  }

  // 로그인 이후 토큰을 기반한 유저정보를 가져오는 API
  @Get()
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      limit: 3, // 3번까지 허용
      ttl: 60000, // 1분 동안
    },
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: '개인 정보 API',
    description: '로그인 이후 토큰을 기반한 정보 가져오는 API',
  })
  async authenticate(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  // 구글 로그인
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: '구글 로그인 API' })
  async googleLogin() {
    return HttpStatus.OK;
  }

  // 구글 로그인 콜백
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: '구글 로그인 콜백 API' })
  async googleLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const { user } = req;
    const { token: accessToken, cookie: accessTokenCookie } =
      this.authService.generateToken(user.id, 'access');
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.generateToken(user.id, 'refresh');

    await this.userService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    res.send({ user });
  }

  // 카카오 로그인
  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ summary: '카카오 로그인 API' })
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ summary: '카카오 로그인 콜백 API' })
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
  @ApiOperation({ summary: '네이버 로그인 API' })
  async naverLogin() {
    return HttpStatus.OK;
  }

  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({ summary: '네이버 로그인 콜백 API' })
  async naverLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;
    const { token: accessToken, cookie: accessTokenCookie } =
      this.authService.generateToken(user.id, 'access');
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.authService.generateToken(user.id, 'refresh');

    await this.userService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    res.send({ user });
  }

  // 이메일 확인용
  @Post('/email/send')
  @ApiOperation({ summary: '이메일 확인용 API' })
  async initEmailAddressVerification(
    @Body() emailDto: EmailDto,
  ): Promise<boolean> {
    return await this.authService.sendEmailVerification(emailDto.email);
  }

  // 랜덤번호 확인
  @Post('/email/check')
  async checkEmailAndRedis(
    @Body() emailValificationDto: EmailValificationDto,
  ): Promise<boolean> {
    const { email, code } = emailValificationDto;
    return await this.authService.validateEmailNumber(email, code);
  }

  // 비밀번호 찾는 메일 보내기
  @Post('/find/password')
  @ApiOperation({ summary: '비밀번호 찾는 메일 보내는 API' })
  async findPassword(@Body() emailDto: EmailDto) {
    return await this.authService.findPasswordSendEmail(emailDto.email);
  }

  // 비밀번호 변경
  @Post('/change/password')
  @ApiOperation({ summary: '비밀번호 변경 API' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { token, password } = changePasswordDto;
    return await this.userService.changePasswordWithToken(token, password);
  }
}
