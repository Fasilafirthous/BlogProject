import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { TokenResponse } from './dto/user.response';
import { CognitoGuard } from 'src/auth/cognito.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserID } from 'src/auth/decorators/currentuser.decorators';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(()=> String)
  public async verifySignUpCode(@Args('code') code: string, @Args('email') email: string){
    return this.userService.verifySignUpCode(code,email)
  }

  @Query(()=> String)
  public async resendCode(@Args('email') email: string){
    return this.userService.resendCode(email)
  }
  @Query(() => User)
  @UseGuards(CognitoGuard)
  async findByEmail(@Args('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Query(() => [User])
  @UseGuards(CognitoGuard)
   async findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(CognitoGuard)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(CognitoGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(CognitoGuard)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @Query(()=> TokenResponse)
  async login(
    @Args('username') username: string,
    @Args('password') password: string 
  ){
    return this.userService.login(username,password)
  }

  @Query(()=> User)
  @UseGuards(CognitoGuard)
  async getCurrentUser(
    @CurrentUser() currentUser: User
  ){
      return currentUser;
  }


  @Query(()=> String)
  async changePassword(@Args('email')email:string, @Args('oldPassword') oldPassword:string, @Args('newPassword')newPassword:string){
    return this.userService.changePassword(email,oldPassword,newPassword);
  }

  @Mutation(()=> String)
  @UseGuards(CognitoGuard)
  async updateProfile(
    @Args('updateProfile') updateProfile: UpdateUserInput
  ){
        return this.userService.updateProfile(updateProfile)
  }

}
