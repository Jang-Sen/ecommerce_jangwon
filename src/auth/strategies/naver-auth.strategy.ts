import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Provider } from '@user/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.NAVER,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('NAVER_AUTH_CLIENT_ID'),
      clientSecret: configService.get('NAVER_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_AUTH_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, displayName } = profile;
    const { profile_image, email } = profile._json;

    console.log(email);

    try {
      const user = await this.userService.getUserBy('email', email);

      if (user.provider !== provider) {
        throw new HttpException(
          `You are already subscribed to ${user.provider}`,
          HttpStatus.CONFLICT,
        );
      }

      console.log('-----------------------');
      done(null, user);
    } catch (e) {
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          email: email,
          username: displayName,
          profileImg: profile_image,
          provider: provider,
        });

        console.log('++++++++++++++++++++');
        done(null, newUser);
      }
    }
  }
}
