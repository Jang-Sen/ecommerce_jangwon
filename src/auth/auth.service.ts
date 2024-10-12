import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입 로직
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  // 로그인 로직
  async loginUser(loginUserDto: LoginUserDto) {
    // email 유무 체크 -> 비밀번호 매칭 -> return user
    const user = await this.userService.getUserBy('email', loginUserDto.email);

    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isMatched) {
      throw new HttpException(
        'Password Do Not Matched',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  // 회원가입 후 보내는 웰컴 메일 로직
  async welcomeSignupMail(email: string) {
    await this.emailService.sendMail({
      to: email,
      subject: 'welcome to jangwon world',
      // text: '회원가입 메일 전송 완료',
      html: `<h1>welcome to jangwon world</h1>`,
    });
  }

  // 엑세스 토큰 발행 로직
  public generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return accessToken;
  }
}
