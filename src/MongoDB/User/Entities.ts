import { Privilege } from "../Entities"
import { ObjectId } from "mongodb"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Player } from "../Player/Entities"
import dayjs from "dayjs"
import { IsEmail } from "class-validator"

@ObjectType()
export class AuthData {
    @Field()
    token: string
    @Field({ nullable: true })
    expiresIn?: string
}

export enum Sex {
    Male,
    Female
}

@ObjectType()
export class Credentials {
    @Field()
    @IsEmail()
    email: string
    confirmed: boolean
    password: string
}

type CreateOrUpdateRegistryType = {
    name?: string
    surname?: string
    dateOfBirth?: Date|string
    sex?: Sex
    country?: string
    phone?: string
}
@ObjectType()
export class Registry {
    @Field()
    name: string
    @Field()
    surname: string
    @Field(() => String)
    dateOfBirth: Date|string
    @Field(() => Int)
    sex: Sex
    @Field()
    country: string
    @Field()
    phone: string

    constructor(data?: CreateOrUpdateRegistryType) {
        if(!data) return
        if(data.name) this.name = data.name
        if(data.surname) this.surname = data.surname
        if(data.dateOfBirth) this.dateOfBirth = dayjs(data.dateOfBirth).toISOString()
        if(![null, undefined].includes(data.sex)) this.sex = data.sex
        if(data.country) this.country = data.country
        if(data.phone) this.phone = data.phone
    }
}

type CreateOrUpdateUserType = {
    _id?: ObjectId
    createdBy?: ObjectId
    createdAt?: Date|string
    updatedAt?: Date|string
    registry?: CreateOrUpdateRegistryType
    credentials?: Credentials
    privileges?: Privilege[]
    confirmed?: boolean
    player?: ObjectId
}
@ObjectType()
export class User {
    @Field(() => ID)
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date|string
    updatedAt: Date|string
    @Field(() => Registry)
    registry: Registry
    @Field(() => Credentials, { nullable: true })
    credentials?: Credentials
    privileges: Privilege[]
    @Field({ nullable: true })
    confirmed?: boolean
    @Field(() => Player, { nullable: true })
    player?: ObjectId

    constructor(data?: CreateOrUpdateUserType) {
        if(!data) return
        if(data._id) this._id = new ObjectId(data._id)
        if(data.createdBy) this.createdBy = new ObjectId(data.createdBy)
        if(data.createdAt) this.createdAt = dayjs(data.createdAt).toISOString()
        if(data.updatedAt) this.updatedAt = dayjs(data.updatedAt).toISOString()
        if(data.registry) this.registry = new Registry(data.registry)
        if(data.credentials) this.credentials = data.credentials
        if(data.privileges) this.privileges = data.privileges
        if(data.player) this.player = new ObjectId(data.player)
    }
}