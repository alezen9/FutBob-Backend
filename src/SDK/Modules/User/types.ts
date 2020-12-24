import { Sex } from "../../../MongoDB/User/Entities";


export type UserInputRequired = {
   name: string,
   surname: string,
   dateOfBirth: string,
   phone: string,
   email?: string,
   sex: Sex,
   country: string
}

export type UserInput = Partial<UserInputRequired>