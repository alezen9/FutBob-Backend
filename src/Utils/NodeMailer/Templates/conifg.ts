import ejs from "ejs";

export enum TemplateID {
   CONFIRM_REGISTRATION = 'CONFIRM_REGISTRATION'
}

type TemplateConfig = {
   _id: TemplateID
   description?: string
   compile: () =>  string
}

export const TemplateLib = Object.freeze({
   [TemplateID.CONFIRM_REGISTRATION]: {
      _id: TemplateID.CONFIRM_REGISTRATION,
      description: `User have to confirm the registration before starting to use the platform.`,
      compile: async (link: string): Promise<string> => {
         return ejs.renderFile(`${__dirname}/ConfirmRegistration/index.ejs`, { link })
      }
   }
})