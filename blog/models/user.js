const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, minLength: 5, require: true },
    name: {type:String, minLength: 3, require: true},
    passwordHash: {type:String, require: true}, 
    blogs: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)