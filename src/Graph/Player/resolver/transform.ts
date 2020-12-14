import DataLoader from 'dataloader'
import { mongoPlayer } from '../../../MongoDB/Player'
import { Player } from '../../../MongoDB/Player/Entities'
import { userLoader } from '../../User/resolver/transform'

/** Helpers */

const getPlayerById = async (_id: string) => {
  try {
    return await mongoPlayer.getPlayerById(_id).then(res => gql_Player(res))
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const playerLoader = new DataLoader(playerIds => {
  const promises = playerIds.map(getPlayerById)
  return Promise.all(promises)
})


/** GQL */

export const gql_Player = (player: Player) => {
  const { user, ...rest } = mongoPlayer.getTypePlayerFields(player)
  return {
    ...rest,
    user: () => userLoader.load(user)
  }
}