import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../../MongoDB/User'

/** Loaders */

export const userLoader = new DataLoader((userIds: (string|ObjectId)[]) => {
  return mongoUser.getUserByIds(userIds)
})