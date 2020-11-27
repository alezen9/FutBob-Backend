import { Privilege } from "../Entities"
import { ObjectId } from "mongodb"

export enum Sex {
    Male,
    Female
}

export class Credentials {
    username: string
    password: string
}

export class User {
    _id: ObjectId
    createdBy: ObjectId
    name: string
    surname: string
    dateOfBirth: Date
    sex: Sex
    country: string
    createdAt: Date
    updatedAt: Date
    privileges: Privilege[]
    futsalPlayer?: ObjectId
    footballPlayer?: ObjectId
    avatar?: string
    credentials: Credentials
    email?: string
    phone: string
}