const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });
const playlistRouter = require('./playlistRoutes')

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router
    .route('/my/profile')
    .get(authController.isAuthenticated, userController.getUserProfile)
    .patch(authController.isAuthenticated, userController.updateUserProfile)


router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/history')
    .patch(authController.isAuthenticated, userController.addVideoToHistory)
    .get(authController.isAuthenticated, userController.getHistory)


router
    .route('/history/clear')
    .patch(authController.isAuthenticated, userController.clearHistory)

router
    .route('/history/remove')
    .patch(authController.isAuthenticated, userController.removeVideoFromHistory)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


router.use('/:userId/playlists', playlistRouter)
router.use('/:userId/playlists/', playlistRouter)


module.exports = router;