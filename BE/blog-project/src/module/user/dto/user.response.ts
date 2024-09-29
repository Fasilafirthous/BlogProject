import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokenResponse {
  @Field()
  AccessToken: string;

  @Field()
  RefreshToken: string;
}