const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Please provide a username'] },
    email: {
        type: String,
        unique: [true, 'Account already exist with this account'],
        lowerase: true,
        required: [true, 'A user must have a email'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must 8 characters long'],
        select: false
    }
})

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
})

// Password hash middleware.


module.exports = mongoose.model('Users', UserSchema)