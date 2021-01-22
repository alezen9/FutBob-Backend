import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import ErrorMessages from '../ErrorMessages'
import { SendEmailOptions } from './types'
import { google } from 'googleapis'
require('dotenv').config()

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS
} = process.env



const TEMPLATES = {
  subscribe: {
    fileName: 'subscribe.ejs',
    subject: '[ABC Inc.] Welcome to ABC Inc.',
  },
}


class FutBobNodeMailer {
   private smtpTransport: Mail
   private mailOptions: Partial<Mail.Options>

   constructor() {
      const oauth2Client = new google.auth.OAuth2(
         MAILING_SERVICE_CLIENT_ID,
         MAILING_SERVICE_CLIENT_SECRET,
         OAUTH_PLAYGROUND
      )
      oauth2Client.setCredentials({
         refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
      })
      const accessToken = oauth2Client.getAccessToken()
      this.smtpTransport = this.createTransporter(accessToken)
      this.mailOptions = this.setMainOptions()
   }

   private createTransporter(accessToken: any): Mail {
      return nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
         },
      })
   }

   cleanUp() {
      if(this.smtpTransport) this.smtpTransport.close()
   }

   private setMainOptions(): Partial<Mail.Options> {
      return {
         from: SENDER_EMAIL_ADDRESS,
         subject: 'Confirm your email for FutBob'
      }
   }

   private checkOptions(options: SendEmailOptions) {
      if(!options.text && !options.html) throw new Error(ErrorMessages.system_content_required_for_email)
      if(options.text && options.html) throw new Error(ErrorMessages.system_html_or_text_only_for_email)
   }

   sendEmailSync(options: SendEmailOptions){
      this.checkOptions(options)
      const mail: Mail.Options = {
         ...this.mailOptions,
         to: options.to,
         ...options.text && { text: options.text },
         ...options.html && { html: options.html }
      }
      this.smtpTransport.sendMail(mail, (error, info) => {
         if (error) {
            console.log(error)
            throw new Error(ErrorMessages.system_confirmation_email_not_sent)
         } else {
            console.log('### CONFIRMATION email sent ###')
            console.log('to: ', options.to)
            console.log(info.response)
            console.log('###############################')
         }
      })
   }
}

export const nodemailerInstance = new FutBobNodeMailer()