import { EnumSortPlayer, SortPlayer } from "../../Graph/Player/inputs"
import { transformSortValue } from "../helpers"

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


export const getSortStage = (sort: SortPlayer) => {
  return {
    $sort: {
      [getSortField(sort.field)]: sort.sort ? transformSortValue(sort.sort) : 1,
      _id: 1
    }
  }
}

const getSortField = (field: EnumSortPlayer) => {
  if(field === EnumSortPlayer.name) return "fullName"
  if(field === EnumSortPlayer.country) return "userData.registry.country"
  if(field === EnumSortPlayer.age) return "userData.registry.dateOfBirth"
  return "fullName"
}