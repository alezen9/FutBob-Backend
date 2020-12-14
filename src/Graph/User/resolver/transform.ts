import DataLoader from 'dataloader'
import { mongoUser } from '../../../MongoDB/User'
import { User } from '../../../MongoDB/User/Entities'
import { playerLoader } from '../../Player/resolver/transform'

/** Helpers */

const getUserById = async (_id: string) => {
  try {
    return await mongoUser.getUser({ _id }).then(res => gql_User(res))
  } catch (err) {
    throw err
  }
}


/** Loaders */

export const userLoader = new DataLoader(userIds => {
  const promises = userIds.map(getUserById)
  return Promise.all(promises)
})

/** GQL */

export const gql_User = (user: User) => {
  const { futsalPlayer, footballPlayer, ...rest } = mongoUser.getTypeUserFields(user)
  return {
    ...rest,
    futsalPlayer: futsalPlayer
      ? () => playerLoader.load(futsalPlayer)
      : null,
    footballPlayer: footballPlayer
      ? () => playerLoader.load(footballPlayer)
      : null
  }
}