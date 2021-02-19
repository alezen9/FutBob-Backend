import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { mongo_Dev } from "../../MongoDB/_Dev";
import { nodemailerInstance } from "../../NodeMailer";

@Resolver()
export class _DevResolver {

   @Query(() => Boolean)
   async _Dev_backupAll(): Promise<Boolean> {
      await mongo_Dev._backupAll()
      return true
   }

   @Query(() => Boolean)
   async _Dev_bonificaAll(): Promise<Boolean> {
      await mongo_Dev._bonificaAll()
      return true
   }

   @Query(() => Boolean)
   async _Dev_testEmail(@Arg('email') email: string): Promise<Boolean> {
      await nodemailerInstance.emails.accountVerification.compileAndSend(email, { link: 'https://youtube.com', expiresIn: 2 })
      await nodemailerInstance.emails.resetPassword.compileAndSend(email, { link: 'https://youtube.com', expiresIn: 2 })
      return true
   }
}