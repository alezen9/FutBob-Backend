import { Privilege } from "../Entities"
import { ObjectId } from "mongodb"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Player } from "../Player/Entities"
import dayjs from "dayjs"

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
    username: string
    password: string
}

type CreateOrUpdateRegistryType = {
    name?: string
    surname?: string
    dateOfBirth?: Date
    sex?: Sex
    country?: string
    email?: string
    phone?: string
}
@ObjectType()
export class Registry {
    @Field()
    name: string
    @Field()
    surname: string
    @Field(() => String)
    dateOfBirth: Date
    @Field(() => Int)
    sex: Sex
    @Field()
    country: string
    @Field({ nullable: true })
    email?: string
    @Field()
    phone: string

    constructor(data?: CreateOrUpdateRegistryType) {
        if(!data) return
        if(data.name) this.name = data.name
        if(data.surname) this.surname = data.surname
        if(data.dateOfBirth) this.dateOfBirth = dayjs(data.dateOfBirth).toDate()
        if(data.sex) this.sex = data.sex
        if(data.country) this.country = data.country
        if(data.email) this.email = data.email
        if(data.phone) this.phone = data.phone
    }
}

type CreateOrUpdateUserType = {
    _id?: ObjectId
    createdBy?: ObjectId
    createdAt?: Date
    updatedAt?: Date
    registry?: CreateOrUpdateRegistryType
    credentials?: Credentials
    privileges?: Privilege[]
    player?: ObjectId
}
@ObjectType()
export class User {
    @Field(() => ID)
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    @Field(() => Registry)
    registry: Registry
    @Field(() => Credentials, { nullable: true })
    credentials?: Credentials
    privileges: Privilege[]
    @Field(() => Player, { nullable: true })
    player?: ObjectId

    constructor(data?: CreateOrUpdateUserType) {
        if(!data) return
        if(data._id) this._id = new ObjectId(data._id)
        if(data.createdBy) this.createdBy = new ObjectId(data.createdBy)
        if(data.createdAt) this.createdAt = dayjs(data.createdAt).toDate()
        if(data.createdBy) this.updatedAt = dayjs(data.updatedAt).toDate()
        if(data.createdBy) this.registry = new Registry(data.registry)
        if(data.credentials) this.credentials = data.credentials
        if(data.createdBy) this.privileges = data.privileges
        if(data.player) this.player = new ObjectId(data.player)
    }
}