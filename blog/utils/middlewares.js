const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../utils/config')

const requestLogger = (request, response, next) => {
    logger.info('METHOD: ', request.method)
    logger.info('PATH:', request.path)
    logger.info('BODY: ', request.body)
    logger.info('----------')
    next()
}

const invalidPath = (request, response, next) => {
    response.status(404).send({error: 'invalid path'})
    next()
}

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if(error.name === 'MongoServerError'){
        return response.status(400).send({error: error.message})
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')){
        const token = authorization.replace('Bearer ', '')
        request.user = jwt.verify(token, TOKEN_SECRET)
    }
    next()
}

module.exports = { requestLogger, invalidPath, errorHandler, tokenExtractor }