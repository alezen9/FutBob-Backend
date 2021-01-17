import { Privilege } from "../MongoDB/Entities"
import ErrorMessages from "../Utils/ErrorMessages"
import { decodePrivileges } from "../Utils/helpers"

const jwt = require('jsonwebtoken')

const isAuthMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }

  const [protocol, token] = authHeader.split(' ')
  if (!token || token === '' || !protocol || protocol !== 'Bearer') {
    req.isAuth = false
    return next()
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) throw err
      return decoded
    })
  } catch (err) {
    req.isAuth = false
    req.authErr = err.name
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.idUser = decodedToken.idUser
  req.privileges = decodePrivileges(decodedToken.privileges)
  return next()
}

export const checkPrivileges = (req, params?: any) => {
  if(!(req.privileges.includes(Privilege.Manager) || req.privileges.includes(Privilege.Developer))){
    throw new Error(ErrorMessages.system_permission_denied)
  }
}

export default isAuthMiddleware