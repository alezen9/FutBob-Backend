import { Sex } from "../MongoDB/User/entities";
import { PlayerPosition, PhysicalState, PlayerType, PlayerScore } from "../MongoDB/Player/Entities";

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
    position?: PlayerPosition,
    type?: PlayerType,
    matchId?: string,
    state?: PhysicalState
}