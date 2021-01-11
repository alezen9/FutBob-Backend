import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData, User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { LoginInput, RegisterInput } from "./inputs";
import bcrypt from 'bcrypt'
import { Privilege } from "../../MongoDB/Entities";

@Resolver()
export class UserResolver {

   @Query(() => User)
   async getMe(@Ctx() ctx): Promise<User> {
      const { req } = ctx
      if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
      const user: User = await mongoUser.getUser({ _id: req.idUser })
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      return user
   }

   // @Mutation(() => AuthData)
   // async register(@Arg('body') body: RegisterInput): Promise<AuthData> {
   //    const idUser = await mongoUser.createUser(body)
   //    const tokenData = {
   //       idUser,
   //       privileges: [Privilege.Manager]
   //    }
   //    const token = mongoUser.generateJWT(tokenData)
   //    return {
   //       token,
   //       expiresIn: mongoUser.tokenExpiration
   //    }
   // }
   
}

export { UserFieldResolver } from './UserFieldResolver'
