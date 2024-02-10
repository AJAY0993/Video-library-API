const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router
    .route('/profile')
    .get(authController.isAuthenticated, userController.getUserProfile)

router
    .route('/playlists')
    .get(authController.isAuthenticated, userController.getPlaylists)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/history')
    .patch(authController.isAuthenticated, userController.updateHistory)
    .get(authController.isAuthenticated, userController.getHistory)


router
    .route('/history/clear')
    .patch(authController.isAuthenticated, userController.clearHistory)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;