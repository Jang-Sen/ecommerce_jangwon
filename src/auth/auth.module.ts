import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@email/email.module';
import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { AccessTokenStrategy } from '@auth/strategies/accessToken.strategy';
import { LocalAuthStrategy } from '@auth/strategies/local-auth.strategy';

@Module({
  imports: [ConfigModule, UserModule, EmailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, AccessTokenStrategy],
})
export class AuthModule {}
