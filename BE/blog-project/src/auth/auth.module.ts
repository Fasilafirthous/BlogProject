import { Module } from '@nestjs/common';
import { AuthConfiguration } from './auth.configuration';
import { JwtStrategy } from './jwt.stratergy';
import { CognitoGuard } from '../auth/cognito.guard';
import { PassportModule } from '@nestjs/passport';
import { CognitoModule } from '../aws/cognito.module';
import { UserModule } from '../module/user/user.module';
import { MyLogger } from 'src/logger/logger.service';
import { CognitoService } from 'src/aws/cognito.service';

import { UserService } from 'src/module/user/user.service';
import { UserRepositoy } from 'src/module/user/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    CognitoModule,
    CognitoService,
  ],
  providers: [AuthConfiguration, JwtStrategy, CognitoGuard,MyLogger,UserService,UserRepositoy],
  exports: [ AuthConfiguration, JwtStrategy],
})
export class AuthModule {}
