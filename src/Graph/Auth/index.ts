import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData } from "../../MongoDB/User/Entities";
import { FinalizeRegistrationInput, LoginInput, RegisterInput, RequestResendInput } from "./inputs";
import jwt from 'jsonwebtoken'
import { nodemailerInstance } from "../../NodeMailer";

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

   /**
    * 
    * Registration flow
    */
   // Request registration => email to user
   @Mutation(() => Boolean)
   async Auth_requestRegistration(@Arg('body') body: RegisterInput): Promise<Boolean> {
      return mongoUser.requestRegistration(body)
   }

   // Request registration => email to user => verify code (again)
   @Mutation(() => Boolean)
   async Auth_requestRegistrationEmailResend(@Arg('expiredCode') expiredCode: string): Promise<Boolean> {
      return mongoUser.requestRegistrationEmailResend(expiredCode)
   }

   // Request registration => email to user => finalize with passwords and unverified code => token
   @Mutation(() => AuthData)
   async Auth_finalizeRegistration(@Arg('body') body: FinalizeRegistrationInput): Promise<AuthData> {
      return mongoUser.finalizeRegistration(body)
   }


   /**
    * 
    * Reset password flow
    */
   // Request password reset => email to user
   @Mutation(() => Boolean)
   async Auth_requestResetPassword(@Arg('email') email: string): Promise<Boolean> {
      return mongoUser.requestResetPassword(email)
   }

   // Request password reset => email to user => verify code (again)
   @Mutation(() => Boolean)
   async Auth_requestResetPasswordEmailResend(@Arg('expiredCode') expiredCode: string): Promise<Boolean> {
      return mongoUser.requestResetPasswordEmailResend(expiredCode)
   }

   // Request password reset => email to user => finalize with new passwords and unverified code => token
   @Mutation(() => AuthData)
   async Auth_finalizeResetPassword(@Arg('body') body: FinalizeRegistrationInput): Promise<AuthData> {
      return mongoUser.finalizeResetPassword(body)
   }

   // @Query(() => Boolean)
   // async Auth_testEmail(): Promise<Boolean> {
   //    await nodemailerInstance.emails.accountVerification.compileAndSend('aj0715@live.com', { link: 'https://youtube.com', expiresIn: 2 })
   //    await nodemailerInstance.emails.resetPassword.compileAndSend('aj0715@live.com', { link: 'https://youtube.com', expiresIn: 2 })
   //    return true
   // }
}