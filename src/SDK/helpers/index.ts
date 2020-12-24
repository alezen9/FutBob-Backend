import { isObject } from 'lodash'

export const FieldsToQuery = (fields: object, isList: boolean = false): string => isList
   ? `{ totalCount, result { ${FieldsToQueryHelper(fields)}} }`
   : `{ ${FieldsToQueryHelper(fields)}}`

const FieldsToQueryHelper = (o: object) => {
  let str = ''
  const entries = Object.entries(o)
  const n = entries.length
  let i = 0
  for(const [key, val] of entries){
    i++
    const isLast = i === n
    if(isObject(val)) {
      str += `${key} { ${FieldsToQueryHelper(val)} }${isLast ? '' : ','} `
    } else str += `${key}${isLast ? '' : ','} `
  }
  return str
}

export const paramsToString = params => {
  let str = ''
  for (const key in params) {
    if(isObject(params[key])){
      if(params[key] instanceof Array) str += key + ':' + '['+params[key].map(el => isNaN(el) ? `"${el}"` : el)+']' + ', '
      else str += key + ':' + paramsToString(params[key]) + ', '
    } else if(isNaN(params[key])) str += key + ':"' + params[key] + '", '
    else str += key + ':' + params[key] + ', '
  }
  return `{${str.slice(0, -2)}}`
}