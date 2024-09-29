import { CognitoService } from '../aws/cognito.service';
import { Inject, Injectable } from '@nestjs/common';


@Injectable()
export class AuthConfiguration {
  constructor(
   private readonly cognitoService: CognitoService,
  ) {}
  public userPoolId: string = 'ap-south-1_6LrDB3a9K';
  public clientId: string = '3irbri6s7dcp8ok719gks1bi9t';
  public region: string = 'ap-south-1';
  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}
