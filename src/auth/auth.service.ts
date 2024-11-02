import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { EmailService } from '@email/email.service';
import { TokenPayloadInterface } from '@auth/interfaces/tokenPayload.interface';
import { Provider } from '@user/entities/provider.enum';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입 로직
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      ...createUserDto,
      provider: Provider.LOCAL,
    });
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

  // 이메일 인증 보내는 함수
  async sendEmailVerification(email: string) {
    const genarateNum = this.generateOTP();

    // cache에 저장
    await this.cacheManager.set(email, genarateNum);

    return await this.emailService.sendMail({
      to: email,
      subject: 'jangwon service - verification email address',
      text: `Plz random number ${genarateNum}`,
    });
  }

  // 이메일로 비밀번호 찾기
  async findPasswordSendEmail(email: string) {
    const payload: any = { email };
    const user = await this.userService.getUserBy('email', email);

    // 소셜로그인 시 가입자는 비밀번호 변경 불가
    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        `You can't change the password for the part you registered as a social login`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // password 변경 관련 토큰 생성
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECRET'),
      expiresIn: this.configService.get('FIND_PASSWORD_TOKEN_EXPIRATION_TIME'),
    });

    const url = `${this.configService.get('EMAIL_BASE_URL')}/change/password?token=${token}`;

    // email 전송
    await this.emailService.sendMail({
      to: email,
      subject: 'jangwon mall password change',
      text: `비밀번호 변경 ${url}`,
    });
  }

  // 자동 번호 함수
  generateOTP() {
    let otp = '';

    for (let i = 1; i <= 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    return otp;
  }
}
