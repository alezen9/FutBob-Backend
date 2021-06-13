import DataLoader from 'dataloader'
import { mongoField } from '../../MongoDB/Field'
import { Field } from '../../MongoDB/Field/Entities'

const batchFields = async (ids: string[]) => {
  const fields = await mongoField.getFieldsByIds(ids)
  const fieldsMap = fields.reduce<{ [_id: string]: Field }>((acc, field) => {
    return {
      ...acc,
      [String(field._id)]: field
    }
  }, {})
  return ids.map(_id => fieldsMap[_id])
}

export const fieldLoader = new DataLoader(batchFields)