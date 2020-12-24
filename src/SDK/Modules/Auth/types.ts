import { Sex } from "../../../MongoDB/User/Entities"
export type SigninInput = {
   username: string
   password: string
}

export type SignupInput = SigninInput & {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex: Sex,
    country: string
}