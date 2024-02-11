const express = require('express')
const playListController = require('../controllers/playlistController')
const authController = require('../controllers/authController')
const router = express.Router()

router.route('/')
    .get(playListController.getAllPlaylists)
    .post(authController.isAuthenticated, playListController.createPlaylist)

router.route('/:playlistId')
    .get(authController.isAuthenticated, playListController.getPlaylistById)
    .delete(playListController.deletePlaylistById)

router.route('/:playlistId/addVideo')
    .patch(authController.isAuthenticated, playListController.addVideoToPlaylist)

router.route('/:playlistId/removeVideo')
    .patch(playListController.removeVideoFromPlaylist)


module.exports = router