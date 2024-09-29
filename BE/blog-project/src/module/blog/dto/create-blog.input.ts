import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  blogTitle: string;

  @Field(() => String)
  blogContent: string;

}
