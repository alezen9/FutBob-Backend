import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import AccountVerification from './Emails/AccountVerification'
import path from 'path'
import ResetPassword from './Emails/ResetPassword'
require('dotenv').config()

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  MAILING_SERVICE_ACCESS_TOKEN,
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
      return nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken: MAILING_SERVICE_ACCESS_TOKEN
         }
      })
   }

   cleanUp() {
      if(this.smtpTransport) this.smtpTransport.close()
   }
}

export const nodemailerInstance = new ZenNodeMailer()