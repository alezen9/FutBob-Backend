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
  req.priveleges = decodedToken.privileges
  return next()
}

export default isAuthMiddleware