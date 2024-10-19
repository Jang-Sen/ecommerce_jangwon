import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { AccessTokenGuard } from '@auth/guards/accessToken.guard';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { GoogleAuthGuard } from '@auth/guards/google-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  async loggedInUser(@Req() req: RequestWithUserInterface) {
    const user = await req.user;
    const token = await this.authService.generateAccessToken(user.id);

    return { user, token };
  }

  // 로그인 이후 토큰을 기반한 유저정보를 가져오는 API
  @UseGuards(AccessTokenGuard)
  @Get()
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
    const token = await this.authService.generateAccessToken(user.id);

    return { user, token };
  }
}
