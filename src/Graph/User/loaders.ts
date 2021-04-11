import DataLoader from 'dataloader'
import { mongoUser } from '../../MongoDB/User'

/** Loaders */

export const userLoader = new DataLoader((userIds: string[]) => {
  const promises = userIds.map(_id => mongoUser.getUserById(_id))
  return Promise.all(promises)
})