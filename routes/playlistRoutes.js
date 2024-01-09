const express = require('express')
const playListController = require('../controllers/playlistController')
const router = express.Router()

router.route('/')
    .get(playListController.getAllPlaylists)
    .post(playListController.createPlaylist)

router.route('/:playlistId')
    .get(playListController.getPlaylistById)
    .delete(playListController.deletePlaylistById)

router.route('/:playlistId/addVideo')
    .patch(playListController.addVideoToPlaylist)

router.route('/:playlistId/removeVideo')
    .patch(playListController.removeVideoFromPlaylist)


module.exports = router