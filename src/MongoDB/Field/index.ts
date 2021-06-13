import dayjs from 'dayjs'
import { MongoDBInstance } from '..'
import { ObjectId } from 'mongodb'
import { facetCount } from '../helpers'
import { get } from 'lodash'
import { List, Pagination } from '../Entities'
import { Field } from './Entities'
import { CreateFieldInput, FiltersField, UpdateFieldInput } from '../../Graph/Field/inputs'
import { escapeStringForRegExp, createMongoUpdateObject } from '../../Utils/helpers'

class MongoField {

  async create (data: CreateFieldInput, createdBy: string): Promise<string> {
    const now = dayjs().toISOString()
    const _id = new ObjectId()
    const field = new Field({
      _id,
      createdBy,
      createdAt: now,
      updatedAt: now,
      ...data
    })
    await MongoDBInstance.collection.field.insertOne(field)
    return _id.toHexString()
  }

  async update (data: UpdateFieldInput, createdBy: string): Promise<boolean> {
    const { _id, ...rest } = data
    const now = dayjs().toISOString()
    const field = new Field({
      ...rest,
      updatedAt: now
    })
    await MongoDBInstance.collection.field.updateOne(
      { _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) },
      { $set: createMongoUpdateObject(field) }
    )
    return true
  }

  async delete (_id: string, createdBy: string): Promise<boolean> {
    await MongoDBInstance.collection.field.deleteOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
    return true
  }

  async getList (filters: FiltersField, pagination: Pagination, createdBy: string): Promise<List<Field>> {
    const { 
      ids = [],
      type,
      states = [],
      searchText
    } = filters

    const { skip = 0, limit } = pagination
    // set limit to max 100
    const _limit = !limit || limit < 0 || limit > 100
      ? 100
      : limit
      
    const query = []

    // make sure that i can access it
    query.push({ $match: { createdBy: new ObjectId(createdBy) } })
    // filter by id
    if(ids.length) query.push({ $match: { _id: { $in: ids.map(id => new ObjectId(id)) } } })
    // filter by state
    if(states.length) query.push({ $match: { state: { $in: states } } })
    // filter by type
    if(type) query.push({ $match: { type }})
    // filter by searchText
    if(searchText) {
      const searchInName = { $match: { name: new RegExp(escapeStringForRegExp(searchText), 'i') } }
      query.push(searchInName)
    }
    // paginate
    query.push(facetCount({ skip, limit: _limit }))

    const res: Field[] = await MongoDBInstance.collection.field.aggregate(query).toArray()
    const result = {
      totalCount: get(res, '[0].totalCount[0].count', 0) as number,
      result: get(res, '[0].result', []) as Field[]
    }
    return result
  }

  async getFieldById (_id: string, createdBy: string): Promise<Field> {
    const field: Field = await MongoDBInstance.collection.field.findOne({ _id: new ObjectId(_id), createdBy: new ObjectId(createdBy) })
    return field
  }

  async getFieldsByIds (ids: (string|ObjectId)[]): Promise<Field[]> {
    const fields: Field[] = await MongoDBInstance.collection.field.find({ _id: { $in: ids.map(id => new ObjectId(id)) } }).toArray()
    return fields
  }
}

export const mongoField = new MongoField()