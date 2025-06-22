require('dotenv').config()

const PORT = process.env.PORT || 6900

const MONGODB_URI = process.env.NODE_ENV === 'test'
                    ? process.env.TEST_MONGODB_URI
                    : process.env.MONGODB_URI

const TOKEN_SECRET = process.env.TOKEN_SECRET

module.exports = { PORT, MONGODB_URI, TOKEN_SECRET }