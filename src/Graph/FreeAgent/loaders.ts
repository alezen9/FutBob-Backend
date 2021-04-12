import DataLoader from 'dataloader'
import { ObjectId } from 'mongodb'
import { mongoFreeAgent } from '../../MongoDB/FreeAgent'
import { FreeAgent } from '../../MongoDB/FreeAgent/Entities'


/** Helpers */

const getFreeAgentById = async (id: string|ObjectId) => {
  const _id = id instanceof ObjectId
      ? id.toHexString()
      : id
  try {
    return await mongoFreeAgent.getFreeAgentById(_id)
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const freeAgentLoader = new DataLoader<string|ObjectId, FreeAgent>(freeAgentIds => {
  const promises = freeAgentIds.map(getFreeAgentById)
  return Promise.all(promises)
})