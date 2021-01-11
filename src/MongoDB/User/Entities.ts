import { Privilege } from "../Entities"
import { ObjectId } from "mongodb"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Player } from "../Player/Entities"

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
}