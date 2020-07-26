import * as jwt from 'jsonwebtoken'

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
    if(isNaN(params[key])) str += key + ':"' + params[key] + '", '
    else str += key + ':' + params[key] + ', '
  }
  return `{${str.slice(0, -2)}}`
}