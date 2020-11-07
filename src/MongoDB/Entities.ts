import { Collection } from 'mongodb'

export class CollectionContainer {
    user: Collection
    player: Collection
    fields: Collection
}

export enum Privilege {
    Developer,
    Manager,
    User
}

export class GeoPoint {
    type: string
    coordinates: number[]
}

export interface List<T> {
    totalCount: number,
    result: T[]
}