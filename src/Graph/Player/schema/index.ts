import { TypePlayer, TypePace, TypeShooting, TypePassing, TypeDribbling, TypeDefense, TypePhysical, TypeScore } from './types'
import { CreatePlayerInput, UpdatePlayerInput, DeletePlayerInput, PlayerScoreInput, PlayerFilters } from './inputs'
import api from './api'

export default {
  typesAndInputs: `
      ${TypePlayer}
      ${TypePace}
      ${TypeShooting}
      ${TypePassing}
      ${TypeDribbling}
      ${TypeDefense}
      ${TypePhysical}
      ${TypeScore}

      ${CreatePlayerInput}
      ${UpdatePlayerInput}
      ${DeletePlayerInput}
      ${PlayerScoreInput}
      ${PlayerFilters}
   `,
  api
}
