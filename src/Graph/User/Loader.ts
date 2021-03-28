import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../../MongoDB/User'

/** Loaders */

export const userLoader = new DataLoader((userIds: (string|ObjectId)[]) => {
  const promises = userIds.map(_id => mongoUser.getUserById(_id))
  return Promise.all(promises)
})