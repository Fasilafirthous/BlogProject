import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../module/user/entities/user.entity';
import { UserService } from '../module/user/user.service';
import { AuthConfiguration } from './auth.configuration';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _authConfig: AuthConfiguration,
    private readonly userService: UserService,
    private readonly loggerService: MyLogger,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${_authConfig.authority}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: _authConfig.authority,
      algorithms: ['RS256'],
      //  audience: _authConfig.clientId //should only be used with id token
    });
    this.loggerService.log(
      `Auth config is: 
        ${_authConfig.authority}/.well-known/jwks.json`,
      JwtStrategy.name,
    );
  }

  async validate(payload: JwtPayload): Promise<any> {
    let isExpiredToken = false;
    const seconds = 1000;
    const date = new Date();
    const time = date.getTime();
    if (payload.exp < Math.round(time / seconds)) {
      isExpiredToken = true;
    }
    if (isExpiredToken) {
      throw new UnauthorizedException('ACCESS_TOKEN_EXPIRED');
    }

    //payload is whatever we passed in token (roles, claims)
    //add it to context, return user object, will be set in the context
    const user: User = await this.userService.getUserByCond({
      cognitoId: payload.username,
    });
    console.log(user,payload)
    if (!user) {
      throw new UnauthorizedException('Invalid Token!');
    }
    return user; //user will be added to context. This name should be same in decorator. Can be accessed from request
  }
}
