import { Sex } from "../MongoDB/User/entities";
import { PlayerPosition, PhysicalState, PlayerType } from "../MongoDB/Player/Entities";

export interface SignupInput {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex?: Sex,
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
    sex?: Sex
}

export interface UserInputRequired {
    name: string,
    surname: string,
    dateOfBirth: string,
    phone: string,
    email?: string,
    sex: Sex
}

export interface playerData {
  positions: PlayerPosition[],
  state?: PhysicalState,
  type: PlayerType
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
    state?: PhysicalState
}

export interface UpdateUserPlayerInfoInput {
    _id: string,
    name?: string,
    surname?: string,
    dateOfBirth?: string,
    phone?: string,
    email?: string,
    sex?: Sex
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