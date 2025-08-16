const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => { //token 인증안되면 여기서 바로 에러띄워도됨. 어차피 이 미들웨어를 쓴다면 유저 확인이 필수라는 뜻이므로
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return res.status(400).json({ error: 'userId missing or invalid' })
  }

  req.user = user
  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error('ERROR HANDLER:', error.message)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }
  
  next(error)
}

module.exports = { errorHandler, tokenExtractor, userExtractor }