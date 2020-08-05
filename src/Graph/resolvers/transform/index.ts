import DataLoader from 'dataloader'
import { chunk, flatten } from 'lodash'
import { mongoUser } from '../../../MongoDB/User'
import { User } from '../../../MongoDB/User/entities'
import { mongoPlayer } from '../../../MongoDB/Player'
import { Player } from '../../../MongoDB/Player/Entities'

export const userLoader = new DataLoader(userIds => {
  const promises = userIds.map(getUserById)
  return Promise.all(promises)
})

export const playerLoader = new DataLoader(playerIds => {
  const promises = playerIds.map(getPlayerById)
  return Promise.all(promises)
})

const getUserById = async (_id: string) => {
  try {
    return await mongoUser.getUser({ _id }).then(res => gql_User(res))
  } catch (err) {
    throw err
  }
}

const getPlayerById = async (_id: string) => {
  try {
    return await mongoPlayer.getPlayerById(_id).then(res => gql_Player(res))
  } catch (err) {
    throw err
  }
}

export const gql_User = (user: User) => {
  const { futsalPlayer, footballPlayer, ...rest } = mongoUser.getTypeUserFields(user)
  return {
    ...rest,
    futsalPlayer: futsalPlayer
      ? () => playerLoader.load(futsalPlayer)
      : null,
    footballPlayer: footballPlayer
      ? () => playerLoader.load(footballPlayer)
      : null,
  }
}

export const gql_Player = (player: Player) => {
  const { user, ...rest } = mongoPlayer.getTypePlayerFields(player)
  return {
    ...rest,
    user: () => userLoader.load(user)
  }
}