import * as jwt from 'jsonwebtoken'
import { reduce, isObject } from 'lodash'
import moment from 'moment'

export const capitalize = (str: string): string =>  {
    return `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`
}

export const generateJWT = data => {
  const { expires_in: expiresIn, ...rest } = data
  const expiresWithSpan = expiresIn - 60
  const token = jwt.sign(
    rest,
    process.env.SECRET,
    {
      expiresIn: `${expiresWithSpan}s`
    }
  )
  const refreshToken = jwt.sign(
    token,
    process.env.SECRET
  )
  return { tokenExpiration: expiresWithSpan, token, refreshToken }
}

export const lowerCaseFirst = (str:string):string => {
    const [first, ...rest] = str.split('')
  return [
    first.toLowerCase(),
    ...rest
  ].join('')
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

export const ISODates = params => reduce(params, (acc, val, key) => {
  return {
    ...acc,
    [key]: moment(Number(val)).toISOString()
  }
}, {})

export const asyncTimeout = async (milliseconds: number, log: boolean = false): Promise<void> => new Promise((resolve, _) => {
  if(log) console.log(`Attendo ${milliseconds/1000} secondi...`)
  setTimeout(() => resolve(), milliseconds);
})