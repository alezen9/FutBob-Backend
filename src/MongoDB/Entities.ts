import { Max, MaxLength, Min } from 'class-validator'
import { Collection } from 'mongodb'
import { InputType, Field, Int, ObjectType, Float } from 'type-graphql'

export class CollectionContainer {
    user: Collection
    player: Collection
    field: Collection
    freeAgent: Collection
    appointment: Collection
}

export enum Privilege {
    Developer,
    Manager,
    User
}

@ObjectType()
@InputType('geoPoint')
export class GeoPoint {
    type: string
    @Field(() => [Float!]!)
    coordinates: number[]
}

export interface List<T> {
    totalCount: number,
    result: T[]
}
@InputType()
export class Pagination {
   @Field(() => Int)
   @Min(0)
   skip: number
   @Field(() => Int, { nullable: true })
   @Max(100)
   limit?: number
}