import { Sex } from "../MongoDB/User/Entities";
import { PlayerPosition, PhysicalState, PlayerType, PlayerScore } from "../MongoDB/Player/Entities";
import { FieldState, FieldType, Measurements } from "../MongoDB/Fields/Entities";
import { GeoPoint } from "../MongoDB/Entities";

export interface Pagination {
    skip?: number,
    limit?: number
}


/** User */
export interface SignupInput {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex: Sex,
    country: string,
    username: string,
    password: string
}

export interface SigninInput {
    username: string,
    password: string
}

export interface UserInput {
    name?: string,
    surname?: string,
    dateOfBirth?: string,
    phone?: string,
    email?: string,
    sex?: Sex,
    country?: string
}

export interface UserInputRequired {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex: Sex,
    country: string
}


/** Player */
export interface playerData {
  positions: PlayerPosition[],
  state?: PhysicalState,
  type: PlayerType,
  score: PlayerScore
}

interface CreatePlayerInput {
    playerData: playerData
}

export interface CreatePlayerInputWithId extends CreatePlayerInput {
    userId: String,
    playerData: playerData
}

export interface CreatePlayerInputWithUser extends CreatePlayerInput {
    userData: UserInputRequired,
    playerData: playerData
}

export interface UpdatePlayerInfoInput {
    _id: string,
    positions?: PlayerPosition[],
    state?: PhysicalState,
    score?: PlayerScore
}

export interface UpdateUserPlayerInfoInput {
    _id: string,
    name?: string,
    surname?: string,
    dateOfBirth?: string,
    phone?: string,
    email?: string,
    sex?: Sex,
    country?: string
}

export interface DeletePlayerInput {
    _id: string,
    idUser: string,
    type: PlayerType
}

export interface PlayerFilters {
    ids?: string[],
    positions?: PlayerPosition[],
    type?: PlayerType,
    matchIds?: string[],
    states?: PhysicalState[],
    countries?: string[],
    searchText?: string,
    pagination?: Pagination
}


/** Field */
export interface FieldFilters {
    ids?: string[],
    type?: FieldType,
    states?: FieldState[],
    searchText?: string,
    pagination?: Pagination
}

export interface UpdateFieldInput {
    _id: string,
    state?: FieldState,
    type?: FieldType,
    name?: string,
    price?: number,
    measurements?: Measurements,
    location?: GeoPoint
}

export type CreateFieldInput = Required<Omit<UpdateFieldInput, '_id'>>


/** Free Agent */
export interface CreateFreeAgentInput {
    name: string,
    surname: string
}

export interface FreeAgentFilters {
    ids?: string[],
    searchText?: string,
    pagination?: Pagination
}