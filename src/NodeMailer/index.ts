import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import AccountVerification from './Emails/AccountVerification'
import path from 'path'
import ResetPassword from './Emails/ResetPassword'
import chalk from 'chalk'
require('dotenv').config()

const {
//   MAILING_SERVICE_CLIENT_ID,
//   MAILING_SERVICE_CLIENT_SECRET,
//   MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
  SENDER_EMAIL_PASSWORD
} = process.env

type EmailModules = {
   accountVerification: AccountVerification
   resetPassword: ResetPassword
}


export class ZenNodeMailer {
   smtpTransport: Mail
   emails: EmailModules
   assetsPath: string
   templatesPath: string
   from: Mail.Address

   constructor() {
      this.smtpTransport = this.createTransporter()
      this.smtpTransport.verify((err) => {
         if(err) {
            console.error(err)
            this.cleanUp()
         }
         else console.log(chalk.green('[futbob] Nodemailer is ready baby!'))
      })
      this.assetsPath = path.join(__dirname, '/../..', '/public/assets')
      this.templatesPath = path.join(__dirname, '/../..', '/public/templates')
      this.from = {
         name: 'FutBob',
         address: SENDER_EMAIL_ADDRESS
      }
      /** start modules */
      this.emails = {
         accountVerification: new AccountVerification(this),
         resetPassword: new ResetPassword(this)
      }
      /** end modules */
   }

   private createTransporter(): Mail {
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         // auth: {
         //    type: 'OAuth2',
         //    user: SENDER_EMAIL_ADDRESS,
         //    clientId: MAILING_SERVICE_CLIENT_ID,
         //    clientSecret: MAILING_SERVICE_CLIENT_SECRET,
         //    refreshToken: MAILING_SERVICE_REFRESH_TOKEN
         // }
         auth: {
            user: SENDER_EMAIL_ADDRESS,
            pass: SENDER_EMAIL_PASSWORD
         }
      })
      return transporter
   }

   cleanUp() {
      if(this.smtpTransport) this.smtpTransport.close()
   }
}

export const nodemailerInstance = new ZenNodeMailer()