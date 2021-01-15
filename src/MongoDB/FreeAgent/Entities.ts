import dayjs from "dayjs"
import { ObjectId } from "mongodb"
import { Field, ID, ObjectType } from "type-graphql"

type CreateOrUpdateFreeAgent = {
    _id?: ObjectId|string
    name?: string
    surname?: string
    createdBy?: ObjectId|string
    createdAt?: Date
    updatedAt?: Date
}
@ObjectType()
export class FreeAgent {
    @Field(() => ID)
    _id: ObjectId
    @Field()
    name: string
    @Field()
    surname: string
    @Field(() => ID)
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date

    constructor (data?: CreateOrUpdateFreeAgent) {
        if(data._id) this._id = new ObjectId(data._id)
        if(data.name) this.name = data.name
        if(data.surname) this.surname = data.surname
        if(data.createdBy) this.createdBy = new ObjectId(data.createdBy)
        if(data.createdAt) this.createdAt = dayjs(data.createdAt).toDate()
        if(data.updatedAt) this.updatedAt = dayjs(data.updatedAt).toDate()
    }
}