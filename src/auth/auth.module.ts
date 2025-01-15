import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@email/email.module';
import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { AccessTokenStrategy } from '@auth/strategies/accessToken.strategy';
import { LocalAuthStrategy } from '@auth/strategies/local-auth.strategy';
import { GoogleAuthStrategy } from '@auth/strategies/google-auth.strategy';
import { KakaoAuthStrategy } from '@auth/strategies/kakao-auth.strategy';
import { NaverAuthStrategy } from '@auth/strategies/naver-auth.strategy';
import { RefreshTokenStrategy } from '@auth/strategies/refreshToken.strategy';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    EmailModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot([
      // 전체 Auth Module에 관해서
      // {
      //   ttl: 200,
      //   limit: 2, // 60초 동안 10번 만 접속가능, Ddos 공격에 대비, bot 공격 대비
      // },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleAuthStrategy,
    KakaoAuthStrategy,
    NaverAuthStrategy,
  ],
})
export class AuthModule {}
