const express = require('express')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const middlewares = require('./utils/middlewares')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')

const app = express()

const mongoUrl = MONGODB_URI


mongoose
    .connect(mongoUrl)
    .then(result => logger.info('Connected to DB'))
    .catch(error => logger.error('Error connecting to DB: ', error.message))

app.use(express.json())

app.use(middlewares.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', middlewares.tokenExtractor, blogsRouter)
app.use(middlewares.invalidPath)
app.use(middlewares.errorHandler)

module.exports = app