import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  username: string;

  @Field(()=> String)
  email: string;

  @Field(()=> String)
  password: string;

  @Field(()=> String, {nullable:true})
  profileUrl?: string;
}
