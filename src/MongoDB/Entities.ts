import { Collection } from 'mongodb'

export class CollectionContainer {
    user: Collection
    player: Collection
    match: Collection
    aggregationMatches: Collection
    aggregationPlayer: Collection
}

export enum Privilege {
    Developer,
    Manager,
    User
}

export class Location {
    type: string
    coordinates: string[]
}

export interface List<T> {
    totalCount: number,
    result: T[]
}