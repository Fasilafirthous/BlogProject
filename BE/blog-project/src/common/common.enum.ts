import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
   USER= 'user',
   ADMIN = 'Admin'
  }
  
  registerEnumType(UserRole, {
    name: 'UserRole',
  });
     