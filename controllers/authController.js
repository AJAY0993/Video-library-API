const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const AppError = require("../utils/appError")
const genToken = require("../utils/genToken")
const User = require("../models/userModel")
const { json } = require("express")
const catchAsync = require("../utils/catchAsync")

//Signing up new User
const signup = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body
  const user = await User.create({
    username: username,
    email: email,
    password: password
  })
  const token = genToken(user._id, email)
  res.status(201).json({
    status: "success",
    message:
      "Account created successfully now please log in with your credentials",
    data: { user, token }
  })
})

//Logging in Existing User
const login = catchAsync(async (req, res, next) => {
  //check  if data is valid
  const { email, password } = req.body
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400))

  //check if user exist
  const user = await User.findOne({ email: req.body.email }).select("+password")
  if (!user) return next(new AppError("Invalid email id or Password", 401))

  //check if password is correct
  isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect)
    return next(new AppError("Invalid email id or Password", 401))

  const token = genToken(user._id, email)
  res.status(201).json({
    status: "success",
    message: "Logged in successfully",
    data: {
      user,
      token: token
    }
  })
})

//Checking if user is Authenticated or not
const isAuthenticated = catchAsync(async (req, res, next) => {
  //get token from request
  let authHeader = req.headers.authorization
  if (!authHeader) return next(new AppError("Token does not exist", 400))

  let token
  if (authHeader.startsWith("Bearer ")) {
    token = await req.headers.authorization.split(" ")[1]
  }
  if (!token)
    return next(new AppError("You are not authenticated! please log in", 401))
  //check if its legit
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
  // retrive userInfo
  const user = await decodedToken
  if (!user) {
    return new AppError("You are not authenticated! please log in", 401)
  }
  req.user = user
  next()
})

//Checking if User is Authorized or not
const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) return next()
    new Error("You are not authorized", 403)
  }
}

module.exports = { signup, login, isAuthenticated, isAuthorized }
