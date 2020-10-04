export const playerToUserLookupStage = [
  {
    $lookup: {
      from: 'User',
      localField: 'user',
      foreignField: '_id',
      as: 'userData'
    }
  },
  {
    $unwind: {
      path: '$userData',
      preserveNullAndEmptyArrays: true
    }
  }
]

export const unsetUserDataLookup = Object.freeze({ $unset: 'userData' })
