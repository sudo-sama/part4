const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = require('../utils/config')

router.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username: username })
    if(!user)
        return response.status(404).send({error: 'user does not exist'})

    const passwordCheck = await bcrypt.compare(password, user.passwordHash)

    if(!passwordCheck)
        return response.status(404).send({error: 'Invalid password'})

    const infoToTokenize = {
        id: user._id,
        username: user.username
    }

    const token = await jwt.sign(infoToTokenize, TOKEN_SECRET, {expiresIn: '2h'})
    
    response.status(200).send({token, user})
})

module.exports = router