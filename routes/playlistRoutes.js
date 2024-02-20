const express = require('express')
const playListController = require('../controllers/playlistController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(playListController.getAllPlaylists)
    .post(authController.isAuthenticated, playListController.createPlaylist)

router.route('/:playlistId')
    .get(authController.isAuthenticated, playListController.getPlaylistById)
    .delete(authController.isAuthenticated, playListController.deletePlaylistById)

router.route('/:playlistId/videos/:videoId')
    .patch(authController.isAuthenticated, playListController.addVideoToPlaylist)
    .delete(authController.isAuthenticated, playListController.removeVideoFromPlaylist)



module.exports = router