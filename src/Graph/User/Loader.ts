import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoUser } from '../../MongoDB/User'

/** Helpers */

const getUserById = async (id: string|ObjectId) => {
   const _id = id instanceof ObjectId
      ? id.toHexString()
      : id
  try {
    return await mongoUser.getUser({ _id })
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const userLoader = new DataLoader(userIds => {
  const promises = userIds.map(getUserById)
  return Promise.all(promises)
})