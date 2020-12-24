import { GeoPoint } from "../../../MongoDB/Entities"
import { FieldState, FieldType, Measurements } from "../../../MongoDB/Fields/Entities"
import { Pagination } from "../generic_types"
// import { FieldState, FieldType, GeoPoint, Measurements } from "./entities"

export type FieldFilters = {
    ids?: string[],
    type?: FieldType,
    states?: FieldState[],
    searchText?: string,
    pagination?: Pagination
}

export type UpdateFieldInput = {
    _id: string,
    state?: FieldState,
    type?: FieldType,
    name?: string,
    price?: number,
    measurements?: Measurements,
    location?: GeoPoint
}

export type CreateFieldInput = Required<Omit<UpdateFieldInput, '_id'>>