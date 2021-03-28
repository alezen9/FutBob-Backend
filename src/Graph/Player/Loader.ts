import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoPlayer } from '../../MongoDB/Player'

/** Loaders */

export const playerLoader = new DataLoader((playerIds: (string|ObjectId) []) => {
  const promises = playerIds.map(_id => mongoPlayer.getPlayerById(_id))
  return Promise.all(promises)
})