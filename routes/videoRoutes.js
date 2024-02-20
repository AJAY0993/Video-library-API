const express = require('express')
const videoController = require('./../controllers/videoController')
const authController = require('./../controllers/authController')
const commentRouter = require('./commentsRoutes')

const router = express.Router({ mergeParams: true })


router
    .route('/')
    .get(videoController.getAllVideos)
    .post(videoController.createVideo)

router
    .route('/genres')
    .get(videoController.getGenres)

router.route('/:id/views')
    .patch(videoController.incrementViews)

router.route('/:id/like')
    .patch(authController.isAuthenticated, videoController.like)

router.route('/:id/dislike')
    .patch(authController.isAuthenticated, videoController.dislike)

router.use('/:videoId/comments', commentRouter)

router
    .route('/:id')
    .get(videoController.getVideo)
    .patch(videoController.updateVideo)
    .delete(videoController.deleteVideo)


module.exports = router
