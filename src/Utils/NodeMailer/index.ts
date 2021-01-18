import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import ErrorMessages from '../ErrorMessages'
import { SendEmailOptions } from './types'
require('dotenv').config()

class FutbobNodeMailer {
   private transporter: Transporter
   private mailOptions: Partial<Mail.Options>

   constructor (){
      this.transporter = this.createTransporter()
      this.mailOptions = this.setMainOptions()
   }

   private createTransporter(): Transporter {
      return nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.FUTBOB_EMAIL,
            pass: process.env.FUTBOB_EMAIL_PASSWORD
         }
      })
   }

   private setMainOptions(): Partial<Mail.Options> {
      return {
         from: process.env.FUTBOB_EMAIL,
         subject: 'Confirm your email for Futbob'
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
      this.transporter.sendMail(mail, (error, info) => {
         if (error) console.log(error)
         else {
            console.log('### CONFIRMATION email sent ###')
            console.log('to: ', options.to)
            console.log(info.response)
            console.log('###############################')
         }
      })
   }
}

export const nodemailerInstance = new FutbobNodeMailer()