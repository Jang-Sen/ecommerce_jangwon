import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

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
  @Post('/login')
  async loggedInUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.loginUser(loginUserDto);
    const accessToken = await this.authService.generateAccessToken(user.id);

    return { user, token: accessToken };
  }
}
