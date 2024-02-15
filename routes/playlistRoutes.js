const express = require('express')
const playListController = require('../controllers/playlistController')
const authController = require('../controllers/authController')
const router = express.Router()

router.route('/')
    .get(playListController.getAllPlaylists)
    .post(authController.isAuthenticated, playListController.createPlaylist)

router.route('/:playlistId')
    .get(playListController.getPlaylistById)
    .delete(authController.isAuthorized('admin'), playListController.deletePlaylistById)

router.route('/:playlistId/videos/:videoId')
    .patch(authController.isAuthorized('admin'), playListController.addVideoToPlaylist)
    .delete(authController.isAuthorized('admin'), playListController.removeVideoFromPlaylist)



module.exports = router