import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData } from "../../MongoDB/User/Entities";
import { LoginInput, RegisterInput } from "./inputs";
import jwt from 'jsonwebtoken'

@Resolver()
export class AuthResolver {

   @Query(() => Boolean)
   async Auth_isTokenValid(@Arg('token') token: string): Promise<Boolean> {
      const decodedToken: any = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return {}
      return decoded
    })
    if(!decodedToken.idUser) return false
    const user = await mongoUser.getUserById(decodedToken.idUser)
    if(!user) return false
    return true
   }

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