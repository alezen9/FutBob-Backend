import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData, User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { LoginInput, RegisterInput } from "./inputs";
import bcrypt from 'bcrypt'
import { Privilege } from "../../MongoDB/Entities";

@Resolver()
export class AuthResolver {

   @Query(() => AuthData)
   async Auth_login(@Arg('body') body: LoginInput): Promise<AuthData> {
      const { username, password } = body
      const user: User = await mongoUser.getUserByUsername(username)
      if (!user) throw new Error(ErrorMessages.user_user_not_exists)
      const isEqual = await bcrypt.compare(password, user.credentials.password)
      if (!isEqual) throw new Error(ErrorMessages.user_password_not_correct)
      const tokenData = {
         idUser: user._id.toHexString(),
         privileges: user.privileges
      }
      const token = mongoUser.generateJWT(tokenData)
      return {
         token,
         expiresIn: mongoUser.tokenExpiration
      }
   }

   @Mutation(() => AuthData)
   async Auth_register(@Arg('body') body: RegisterInput): Promise<AuthData> {
      const idUser = await mongoUser.create(body)
      const tokenData = {
         idUser,
         privileges: [Privilege.Manager]
      }
      const token = mongoUser.generateJWT(tokenData)
      return {
         token,
         expiresIn: mongoUser.tokenExpiration
      }
   }
}