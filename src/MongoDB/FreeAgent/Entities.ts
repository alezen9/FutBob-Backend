import { ObjectId } from "mongodb"

export class FreeAgent {
    _id: ObjectId
    name: string
    surname: string
    createdBy: ObjectId
    createdAt: Date
    updatedAt: Date
    // appointments?: ObjectId[]
}