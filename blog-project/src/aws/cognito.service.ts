import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AdminUserGlobalSignOutCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  AuthFlowType,
  ListGroupsCommand,
  CreateGroupCommand,
  AdminUpdateUserAttributesCommand
} from "@aws-sdk/client-cognito-identity-provider";
// import { config as configData } from "../../config/config";
// import { logger } from "../../../app";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

// const config: any =
//   configData[(process.env.NODE_ENV as keyof typeof configData) || "dev"];

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'ap-south-1',
});

const clientId = '3irbri6s7dcp8ok719gks1bi9t';
const poolId = 'ap-south-1_6LrDB3a9K';
export class CognitoService {
  public async performAuth(username: string, password: string) {
  
    const userObj = {
      AuthFlow:AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    console.log(userObj)
    console.log(`User Object PerformAuth ${userObj}`);
    try {
      const command = new InitiateAuthCommand(userObj);
      const token = await cognitoClient.send(command);
      // logger.debug(`Token: ${JSON.stringify(token)}`, CognitoService.name);
      return {
        AccessToken: token?.AuthenticationResult?.AccessToken,
        RefreshToken: token?.AuthenticationResult?.RefreshToken,
        IdToken: token?.AuthenticationResult?.IdToken,
      };
    } catch (error:any) {
      // logger.error(`User PerformAuth error`, error, CognitoService.name);
      throw error;
    }
  }

  public async getAccessToken(refreshToken: string) {
    const params = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: clientId,
      UserPoolId: poolId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    try {
      const command = new AdminInitiateAuthCommand(params);
      const token = await cognitoClient.send(command);
      return {
        AccessToken: token?.AuthenticationResult?.AccessToken,
        RefreshToken: refreshToken,
      };
    } catch (error:any) {
      // logger.error(`Get AccessToken error`, error, CognitoService.name);
      throw error;
    }
  }

  public async createUserInCognito(args: any, confirmSignUp = false) {
    const params = {
      ClientId: clientId,
      Password: args.password,
      Username: args.emailId,
      UserAttributes: args?.userAttributes,
    };
    const params1 = {
      UserPoolId:poolId,
      Username: args.emailId,
    };
    try {
      const command = new SignUpCommand(params);
      const data = await cognitoClient.send(command);
      if (confirmSignUp) {
        const confirmCommand = new AdminConfirmSignUpCommand(params1);
        await cognitoClient.send(confirmCommand);
      }
      return data;
    } catch (error: any) {
      // logger.error("User Creation Failed In Cognito!", error, CognitoService.name);
      throw error;
    }
  }

  public async getUserFromCognito(userName: any) {
    const params = {
      UserPoolId: poolId,
      Username: userName,
    };
    try {
      const command = new AdminGetUserCommand(params);
      return await cognitoClient.send(command);
    } catch (error: any) {
      // logger.error("Get User From Cognito Failed!", error, CognitoService.name);
      throw error;
    }
  }

  public async deleteUserInCognito(userName: string) {
    const params = {
      UserPoolId: poolId,
      Username: userName,
    };
    try {
      const command = new AdminDeleteUserCommand(params);
      await cognitoClient.send(command);
      return 'sucess'
    } catch (error: any) {
      // logger.error("Delete User In Cognito Failed!", error, CognitoService.name);
      throw error;
    }
  }

  public async globalSignOut(username: string) {
    console.log(username)
    try {
      const params = {
        UserPoolId: poolId,
        Username: username,
      };
      const command = new AdminUserGlobalSignOutCommand(params);
      await cognitoClient.send(command);
    } catch (error: any) {
      // logger.error("Global Sign-Out Failed!", error, CognitoService.name);
    }
  }

  public async cognitoSetPassword(userName: string, newPassword: string) {
    const params = {
      Password: newPassword,
      UserPoolId: poolId,
      Username: userName,
      Permanent: true,
    };
    try {
      const command = new AdminSetUserPasswordCommand(params);
      await cognitoClient.send(command);
      // logger.debug("Password set successfully", CognitoService.name);
      return "Success";
    } catch (err:any) {
      // logger.error(err.message, err.stack, CognitoService.name);
      throw err;
    }
  }

  public async adminConfirmSignUp(emailId: string) {
    const params = {
      UserPoolId: poolId,
      Username: emailId,
    };
    try {
      const command = new AdminConfirmSignUpCommand(params);
      await cognitoClient.send(command);
    } catch (e: any) {
      // logger.error(e.message, e.stack, CognitoService.name);
    }
  }

  public async cognitoChangePassword(userName: any, oldPassword: any, newPassword: any) {
    const authenticationData = {
      Username: userName,
      Password: oldPassword,
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const poolData = {
      UserPoolId: poolId,
      ClientId: clientId,
    };
    const userData = {
      Username: userName,
      Pool: new AmazonCognitoIdentity.CognitoUserPool(poolData),
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (res) => {
          // logger.log(`*** User authenticated to change password ${res}`, CognitoService.name);
          cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
            if (err) {
              // logger.error(err.message, err.stack, CognitoService.name);
              reject(err);
            }
            // logger.log('call result: ' + result, CognitoService.name);
            resolve('Success');
          });
        },
        onFailure: (err) => {
          // logger.error(err.message, err.stack, CognitoService.name);
          reject(new Error('Incorrect old password'));
        },
      });
    }).catch((err) => {
      throw err;
    });
  }

  public async confirmSignup(emailId: any, code: any) {
    const params = {
      ClientId: clientId,
      ConfirmationCode: code,
      Username: emailId,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      return await cognitoClient.send(command);
    } catch (e: any) {
      // logger.error(e.message, e, CognitoService.name);
      console.log(e.message)
      throw e;
    }
  }

  public async sendConfirmationCode(emailId: any) {
    const params = {
      ClientId: clientId,
      Username: emailId,
    };
    try {
      const command = new ResendConfirmationCodeCommand(params);
      return await cognitoClient.send(command);
    } catch (e: any) {
      // logger.error(e.message, e, CognitoService.name);
      throw e;
    }
  }

  public async addUserToGroup(emailId: string, groupName: string) {
    const params1 = {
      UserPoolId: poolId,
      Username: emailId,
      GroupName: groupName,
    };
    try {
      const command = new AdminAddUserToGroupCommand(params1);
      await cognitoClient.send(command);
    } catch (e: any) {
      // logger.error(e.message, e, CognitoService.name);
    }
  }

  public async checkAndCreateGroup(GroupName: string) {
    try {
        const UserPoolId = poolId
        const listGroupsCommand = new ListGroupsCommand({ UserPoolId});
        const { Groups } = await cognitoClient.send(listGroupsCommand);

        const groupExists = Groups?.some(group => group.GroupName === GroupName);

        if (!groupExists) {
          const createGroupCommand = new CreateGroupCommand({ UserPoolId, GroupName});
            const createGroupResponse:any = await cognitoClient.send(createGroupCommand);
            // logger.log(`Successfully created group '${GroupName}' in User Pool '${UserPoolId}'.`, createGroupResponse);
        } 
    } catch (err:any) {
        // logger.error('Error checking or creating group:', err);
    }
  };
  
}
