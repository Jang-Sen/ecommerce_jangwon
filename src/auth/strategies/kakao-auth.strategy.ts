import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Provider } from '@user/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.KAKAO,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('KAKAO_AUTH_CLIENT_ID'),
      // clientSecret: configService.get('KAKAO_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('KAKAO_AUTH_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, username } = profile;
    const { email } = profile._json.kakao_account;
    const { profile_image } = profile._json.properties;

    try {
      const user = await this.userService.getUserBy('email', email);
      // user가 있으면 DB에서 로그인 처리
      if (user.provider !== provider) {
        throw new HttpException(
          `You are already subscribed to ${user.provider}`,
          HttpStatus.CONFLICT,
        );
      }

      console.log('+++++++++++++++++++++');
      done(null, user);
    } catch (e) {
      // 없으면 회원가입 처리
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          email,
          username,
          profileImg: profile_image,
          provider,
        });

        console.log('-------------------------');
        done(null, newUser);
      }
    }
  }
}
