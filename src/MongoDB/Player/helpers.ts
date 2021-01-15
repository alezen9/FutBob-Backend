export const StageLookupUserForPlayer = [
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

export const StageUnsetLookupUserForPlayer = Object.freeze({ $unset: 'userData' })
