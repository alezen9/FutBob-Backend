import DataLoader from 'dataloader'
import { mongoUser } from '../../MongoDB/User'
import { User } from '../../MongoDB/User/Entities'

const batchUsers = async (ids: string[]) => {
  const users = await mongoUser.getUserByIds(ids)
  const userMap = users.reduce<{ [_id: string]: User }>((acc, user) => {
    return {
      ...acc,
      [String(user._id)]: user
    }
  }, {})
  return ids.map(_id => userMap[_id])
}

export const userLoader = new DataLoader(batchUsers)