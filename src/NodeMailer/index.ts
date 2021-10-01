import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import AccountVerification from './Emails/AccountVerification'
import path from 'path'
import ResetPassword from './Emails/ResetPassword'
import chalk from 'chalk'
require('dotenv').config()

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS
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
         host: 'smtp.gmail.com',
         port: 465,
         secure: true,
         auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: 'ya29.a0ARrdaM-POsjG3TzVt0MkgASHOxBY3N24cDqKd5OR3J6yMwftORjW29PSHXSIeo1Wup7g1u8rANHODhLQGNdVmVkO6KemJiPeEAoa4aR58f8IdjWuAuINE3UKq34kFriSUbwukXc8XIMEywm0Oyr9dcMkFSU6'
         }
      })
      return transporter
   }

   cleanUp() {
      if(this.smtpTransport) this.smtpTransport.close()
   }
}

export const nodemailerInstance = new ZenNodeMailer()