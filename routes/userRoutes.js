const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router
    .route('/my/profile')
    .get(authController.isAuthenticated, userController.getUserProfile)



router
    .route('/liked')
    .get(authController.isAuthenticated, userController.getLiked)

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


router
    .route('/my/playlists')
    .get(authController.isAuthenticated, userController.getPlaylists)
    .post(authController.isAuthenticated, userController.createPlaylist)

router
    .route('/my/playlists/:playlistId')
    .get(authController.isAuthenticated, userController.getPlaylistById)
    .delete(authController.isAuthenticated, userController.deletePlaylistById)

router
    .route('/my/playlists/:playlistId/videos/:videoId')
    .patch(authController.isAuthenticated, userController.addVideoToPlaylist)
    .delete(authController.isAuthenticated, userController.removeVideoFromPlaylist)

router
    .route('/my/watchLater')
    .get(authController.isAuthenticated, userController.getWatchLater)

router.
    route('/my/watchLater/videos/:videoId')
    .patch(authController.isAuthenticated, userController.addVideoToWatchLater)
    .delete(authController.isAuthenticated, userController.removeVideoFromWatchLater)

module.exports = router;