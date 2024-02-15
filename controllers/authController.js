const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AppError = require('../utils/appError')
const genToken = require('../utils/genToken')
const User = require('../models/userModel')
const { json } = require('express')


//Signing up new User
const signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = await User.create({ username: username, email: email, password: password })
        const token = genToken(user._id, email)
        res.status(201).json({
            status: 'success',
            message: 'Account created successfully now please log in with your credentials',
            data: { user, token }
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

//Logging in Existing User
const login = async (req, res, next) => {
    try { //check  if data is valid  
        const { email, password } = req.body
        if (!email || !password) return next(new AppError('Please provide email and password', 400))

        //check if user exist
        const user = await User.findOne({ email: req.body.email }).select('+password')
        if (!user) return next(new AppError('Invalid email id or Password', 401))

        //check if password is correct 
        isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return next(new AppError('Invalid email id or Password', 401));

        const token = genToken(user._id, email)
        res.status(201).json({
            status: 'success',
            message: 'Logged in successfully',
            data: {
                user: { email: email, id: user.id },
                token: token
            }
        })
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}

//Checking if user is Authenticated or not
const isAuthenticated = async (req, res, next) => {
    try {  //get token from request
        const token = await req.headers.authorization.split(' ')[1]
        console.log(token)
        //check if its legit
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken)
        // retrive userInfo 
        const user = await decodedToken;
        if (!user) { return new AppError('you are not authenticated', 401) }
        req.user = user;
        next()
    }
    catch (err) {
        res.status(400).json({
            error: new Error("Invalid request!"),
        });
    }
}

//Checking if User is Authorized or not
const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) return next();
        new Error('You are authorized', 403)
    }
}

module.exports = { signup, login, isAuthenticated, isAuthorized }