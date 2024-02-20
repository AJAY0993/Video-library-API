const express = require('express')
const Router = express.Router({ mergeParams: true })

const commentController = require('./../controllers/commentController')
const authController = require('./../controllers/authController')

Router.route('/')
    .get(commentController.getAllComments)
    .post(authController.isAuthenticated, commentController.createComment)

module.exports = Router