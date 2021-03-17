import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoPlayer } from '../../MongoDB/Player'
import { Player } from '../../MongoDB/Player/Entities'


/** Helpers */

const getPlayerById = async (id: string|ObjectId) => {
  const _id = id instanceof ObjectId
      ? id.toHexString()
      : id
  try {
    return await mongoPlayer.getPlayerById(_id)
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const playerLoader = new DataLoader<string|ObjectId, Player>(playerIds => {
  const promises = playerIds.map(getPlayerById)
  return Promise.all(promises)
})