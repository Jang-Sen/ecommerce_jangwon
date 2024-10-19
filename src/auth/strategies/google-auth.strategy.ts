import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { Provider } from '@user/entities/provider.enum';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.GOOGLE,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { provider, displayName, email, picture } = profile;

    try {
      const user = await this.userService.getUserBy('email', email);

      if (user.provider !== provider) {
        throw new HttpException(
          `You are already subscribed to ${user.provider}`,
          HttpStatus.CONFLICT,
        );
      }

      console.log('++++++++++++++++++++++++');
      done(null, user);
    } catch (e) {
      // 회원가입 로직
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          email: email,
          username: displayName,
          profileImg: picture,
          provider: provider,
        });

        console.log('-------------------------');
        done(null, newUser);
      }
    }
  }
}
