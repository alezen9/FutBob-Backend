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

export class Registry {
    name: string
    surname: string
    dateOfBirth: Date
    sex: Sex
    country: string
    email?: string
    phone: string
}

export class User {
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    registry: Registry
    credentials: Credentials
    privileges: Privilege[]
    player?: ObjectId
}