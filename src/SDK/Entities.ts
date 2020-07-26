import { Sex } from "../MongoDB/User/entities";

export interface SignupInput {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex?: Sex,
    username: string,
    password: string
}

export interface SigninInput {
    username: string,
    password: string
}

export interface UserInput {
    name?: string,
    surname?: string,
    dateOfBirth?: string,
    phone?: string,
    email?: string,
    sex?: Sex
}