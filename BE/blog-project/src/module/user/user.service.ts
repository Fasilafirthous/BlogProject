import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CognitoService } from 'src/aws/cognito.service';
import { UserRepositoy } from './user.repository';
import { UserRole } from 'src/common/common.enum';
import { ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { profile } from 'console';

@Injectable()
export class UserService {

  constructor(private readonly cognitoService: CognitoService,
    private readonly userRepo: UserRepositoy
  ){}

  async login(
    userName: string,
    password: string
  ){
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let user, errorMessage;
    console.log(emailPattern.test(userName))
    if (emailPattern.test(userName)) {
      user = await this.userRepo.findOne({
        where:{
          email: ILike(userName)
        }
      });
      errorMessage = 'Incorrect email or password.';
    } else {
      user = await this.userRepo.findOne({
        where:{
          userName: ILike(userName)
        }
      });
      errorMessage = 'Incorrect username or password.';
    }
    console.log(user,"user")
    if (!user) {
      throw new Error(errorMessage);
    }
    let login;
    try {
      login = await this.cognitoService.performAuth(user.email, password);
    } catch (error) {
      console.log(error);
      throw new Error(errorMessage);
    }
    return login;
  }
  
  public async getUserByCond(condition: any): Promise<User> {
    return this.userRepo.findOneByCond(condition);
  }
  async create(createUserInput: CreateUserInput) {
    try{
      const userExist = await this.findByEmail(createUserInput.email);
      console.log("user",userExist)
      if(userExist.length){
        console.log(19)
        throw new Error('Email Id Already Exist');
      }
      const cognitoresp = await this.cognitoService.createUserInCognito({
        emailId: createUserInput.email,
        password: createUserInput.password,
        UserAttributes: [
          {Name: 'email', Value: createUserInput.email}
        ],
      });
       await this.cognitoService.addUserToGroup(createUserInput.email,'user');
      const user = {
        email: createUserInput.email,
        userName: createUserInput.username,
        cognitoId: cognitoresp.UserSub,
        role: UserRole.USER,
        profileUrl: createUserInput?.profileUrl
      }
      return this.userRepo.save(user)

    }
    catch(err){
      if(err.__type==='UserLambdaValidationException'){
        throw Error('Your account is not authorized to sign up!.');
      }

      throw err;
    }
  }
  async verifySignUpCode(code: string, email: string){
    try{
      console.log(50)
      const userExist = await this.findByEmail(email);
      if(!userExist){
        throw new Error("User does not exist");
      }
      console.log(55)
      const data=await this.cognitoService.confirmSignup(email, code);
      console.log("data",data)
      return "Verified successfully!"
    }
    catch(err){

    }
  }
  async findByEmail(email: string){
    return this.userRepo.find({
      where: {email: email}
    })
  }
  findAll() {
    return this.userRepo.findAll();
  }

  async findOne(id: string) {
    return this.userRepo.find({
      where: {id: id}
    });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.userRepo.update(id,updateUserInput);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async resendCode(email:string){
      return this.cognitoService.sendConfirmationCode(email)
  }

  async changePassword(email:string,oldPassword:string,newPassword:string){
    console.log(134)
      const data = await this.cognitoService.cognitoChangePassword(email,oldPassword,newPassword)
      console.log(data,"data");
      return data;
  }

  async updateProfile(updateProfiles: UpdateUserInput){
    const [userExist] = await this.findOne(updateProfiles?.id);
    if(!userExist){
      throw new Error("User doesn't exist!!");
    }

    if(updateProfiles?.newPassword){
        const updated = await this.changePassword(userExist?.email, updateProfiles?.password, updateProfiles?.newPassword)
        console.log(updated,"updated")

    }
    const user = {
      id: updateProfiles?.id,
      userName: updateProfiles?.username === "" ? userExist?.userName : updateProfiles?.username,
      profileUrl: updateProfiles?.profileUrl ===""? userExist?.profileUrl : updateProfiles?.profileUrl
    }
    await this.userRepo.save(user)
    return "Updated sucessfully!!"
  }
}


