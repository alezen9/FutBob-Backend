import { EnumSortAppointment, SortAppointment } from "../../Graph/Appointment/inputs"
import { transformSortValue } from "../helpers"


export const getSortStage = (sort: SortAppointment) => {
  return {
    $sort: {
      [getSortField(sort.field)]: sort.sort ? transformSortValue(sort.sort) : 1,
      _id: 1
    }
  }
}

const getSortField = (field: EnumSortAppointment) => {
  if(field === EnumSortAppointment.timeAndDate) return "timeAndDate"
  return "timeAndDate"
}