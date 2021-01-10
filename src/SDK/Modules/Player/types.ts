import { PhysicalState, PlayerPosition, PlayerScore } from "../../../MongoDB/Player/Entities";
import { Sex } from "../../../MongoDB/User/Entities";
import { Pagination } from "../generic_types";
import { UserInputRequired } from "../User/types";


export type playerData = {
  positions: PlayerPosition[],
  state?: PhysicalState,
  score: PlayerScore
}

interface CreatePlayerInput {
    playerData: playerData
}

export type CreatePlayerInputWithId = CreatePlayerInput & {
    userId: String,
    playerData: playerData
}

export type CreatePlayerInputWithUser = CreatePlayerInput & {
    userData: UserInputRequired,
    playerData: playerData
}

export type UpdatePlayerInfoInput = {
    _id: string,
    positions?: PlayerPosition[],
    state?: PhysicalState,
    score?: PlayerScore
}

export type UpdateUserPlayerInfoInput = {
    _id: string,
    name?: string,
    surname?: string,
    dateOfBirth?: string,
    phone?: string,
    email?: string,
    sex?: Sex,
    country?: string
}

export type DeletePlayerInput = {
    _id: string,
    idUser: string,
}

export type PlayerFilters = {
    ids?: string[],
    positions?: PlayerPosition[],
    states?: PhysicalState[],
    countries?: string[],
    searchText?: string,
    pagination?: Pagination
}