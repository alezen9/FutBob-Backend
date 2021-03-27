import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoPlayer } from '../../MongoDB/Player'

/** Loaders */

export const playerLoader = new DataLoader((playerIds: (string|ObjectId) []) => {
  return mongoPlayer.getUserByIds(playerIds)
})