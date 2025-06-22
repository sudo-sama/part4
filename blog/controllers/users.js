const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.status(200).send(users)
})

router.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    console.log(username)
    try{
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User(
            { username, name, passwordHash }
        )
        const savedUser = await user.save()
        response.status(201).send(savedUser)
    }
    catch(error){
        next(error)
    }
})

module.exports = router