import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (req: Request) => {
      //     return req?.headers?.authorization;
      //   },
      //   ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 토큰의 위치 -> header에 token을 넣어서 파악
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Authentication;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'), // secret key 매칭
    });
  }

  // 검증 로직
  async validate(payload: TokenPayloadInterface) {
    return await this.userService.getUserBy('id', payload.userId);
  }
}
