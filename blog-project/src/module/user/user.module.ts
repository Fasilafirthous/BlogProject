import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepositoy } from './user.repository';
import { CognitoService } from 'src/aws/cognito.service';

@Module({
  providers: [UserResolver, UserService, UserRepositoy,CognitoService]
})
export class UserModule {}
