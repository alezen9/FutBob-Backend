import dayjs from 'dayjs'
import { PhysicalState, PlayerPosition } from '../../../MongoDB/Player/Entities'
import { Sex } from '../../../MongoDB/User/Entities'

export const player1 = {
  _id: undefined,
  user: {
    _id: undefined,
    registry: {
      name: 'Boban',
      surname: 'Cvetanoski',
      dateOfBirth: dayjs('1997-08-17T22:00:00.000Z').toISOString(),
      phone: '+39 3354567896',
      sex: Sex.Male,
      country: 'MK'
    }
  },
  positions: [
    PlayerPosition.LeftWing,
    PlayerPosition.RightWing,
    PlayerPosition.Back,
    PlayerPosition.GoalKeeper
  ],
  state: PhysicalState.Medium,
  score: {
    pace: {
      speed: 35,
      stamina: 40
    },
    shooting: {
      finishing: 65,
      shotPower: 60,
      longShots: 50
    },
    passing: {
      vision: 73,
      shortPassing: 80,
      longPassing: 64
    },
    technique: {
      agility: 45,
      ballControl: 60,
      dribbling: 55
    },
    defense: {
      interception: 68,
      defensiveAwareness: 65,
      versus: 61
    },
    physical: {
      strength: 55
    }
  }
}

export const player2 = {
  _id: undefined,
  user: {
    _id: undefined,
    registry: {
      name: 'Aleksandar',
      surname: 'Gjoreski',
      dateOfBirth: dayjs('1993-03-06T23:00:00.000Z').toISOString(),
      phone: '+39 3408947641',
      sex: Sex.Male,
      country: 'MK'
    }
  },
  positions: [
    PlayerPosition.LeftWing,
    PlayerPosition.RightWing,
    PlayerPosition.Back,
    PlayerPosition.GoalKeeper
  ],
  state: PhysicalState.Top,
  score: {
    pace: {
      speed: 78,
      stamina: 84
    },
    shooting: {
      finishing: 65,
      shotPower: 91,
      longShots: 86
    },
    passing: {
      vision: 87,
      shortPassing: 93,
      longPassing: 89
    },
    technique: {
      agility: 85,
      ballControl: 85,
      dribbling: 84
    },
    defense: {
      interception: 70,
      defensiveAwareness: 45,
      versus: 40
    },
    physical: {
      strength: 73
    }
  }
}

export const players = [player1, player2]
