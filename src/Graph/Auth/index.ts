import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData } from "../../MongoDB/User/Entities";
import { LoginInput, RegisterInput } from "./inputs";

@Resolver()
export class AuthResolver {

   @Query(() => AuthData)
   async Auth_login(@Arg('body') body: LoginInput): Promise<AuthData> {
      return mongoUser.login(body)
   }

   @Query(() => AuthData)
   async Auth_confirm(@Arg('code') code: string): Promise<AuthData> {
      return mongoUser.confirm(code)
   }

   @Mutation(() => Boolean)
   async Auth_register(@Arg('body') body: RegisterInput): Promise<Boolean> {
      return mongoUser.register(body)
   }
}