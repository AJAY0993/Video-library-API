const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AppError = require('../utils/appError')
const genToken = require('../utils/genToken')
const User = require('../models/userModel')

const signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        console.log(req)
        const user = await User.create({ username: username, email: email, password: password })
        const token = genToken(user._id, email)
        res.status(201).json({
            status: 'success',
            message: 'Account created successfully now please log in with your credentials',
            token
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const login = (req, res, next) => {
}

module.exports = { signup, login }