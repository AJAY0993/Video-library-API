const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Comment = require('./../models/commentModel')
const Video = require('./../models/videoModel')

const getAllComments = catchAsync(async (req, res, next) => {
    let filter;
    const videoId = req.params.videoId
    if (videoId) {
        filter = {
            videoid: videoId
        }
    }
    const comments = await Comment.find(filter)
    res.json({
        status: 'success',
        message: 'Comments fetched successfully', data: {
            comments
        }
    })
})
const createComment = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const { comment, username } = req.body
    let videoId = req.params.videoId
    if (!videoId) {
        videoId = req.body.videoId
    }
    const video = await Video.findById(videoId)
    if (video) {
        const newComment = await Comment.create({
            userid: userId,
            videoid: videoId,
            comment, username
        })
        res.status(201).json({
            status: 'success', message: 'Your comment added successfully', data: {
                comment: newComment
            }
        })
    }
    if (!video) {
        return new AppError('No video found with this ID', 400)
    }
})

module.exports = { getAllComments, createComment }