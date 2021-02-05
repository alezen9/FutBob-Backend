import { ZenNodeMailer } from ".."
import path from 'path'
import ejs from "ejs"
import Mail from "nodemailer/lib/mailer"
import ErrorMessages from "../../Utils/ErrorMessages"
import dayjs from "dayjs"

type Locals = {
   link: string
}

class ResetPassword {
   private _nodemailer: ZenNodeMailer
   private template: string

   constructor(nodemailer: ZenNodeMailer) {
      this._nodemailer = nodemailer
      this.template = path.join(this._nodemailer.templatesPath, '/ResetPassword/index.ejs')
   }

   compileAndSend = async (to: string, locals: Locals) => {
      const html = await ejs.renderFile(`${this.template}`, { ...locals, year: dayjs().year()})
      const mail: Mail.Options = {
         from: this._nodemailer.from,
         subject: 'Reset password',
         to,
         html,
         attachments: [{
            filename: 'FutBob',
            path: path.join(this._nodemailer.assetsPath, '/logo-green.png'),
            cid: 'logo'
         }]
      }
      this._nodemailer.smtpTransport.sendMail(mail, (error, info) => {
         if (error) {
            console.error(error)
            throw new Error(ErrorMessages.system_confirmation_email_not_sent)
         } else {
            console.log('### RESET PASSWORD email sent ###')
            console.log('to: ', to)
            console.log(info.response)
            console.log('###############################')
         }
      })
   }
}

export default ResetPassword