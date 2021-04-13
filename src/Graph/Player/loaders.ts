import DataLoader from 'dataloader'
import { mongoPlayer } from '../../MongoDB/Player'
import { Player } from '../../MongoDB/Player/Entities'

const batchPlayers = async (ids: string[]) => {
  const players = await mongoPlayer.getPlayersByIds(ids)
  const playerMap = players.reduce<{ [_id: string]: Player }>((acc, player) => {
    return {
      ...acc,
      [String(player._id)]: player
    }
  }, {})
  return ids.map(_id => playerMap[_id])
}

export const playerLoader = new DataLoader(batchPlayers)