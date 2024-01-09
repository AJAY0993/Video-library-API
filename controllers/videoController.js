const AppError = require('../utils/appError')
const Video = require('../models/videoModel')

getAllVideos = async (req, res, next) => {
    try {
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete queryObj[el])
        console.log(req.query, queryObj)

        //advanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)

        //build query
        const query = Video.find(JSON.parse(queryStr))

        //execute query
        const videos = await query
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: videos.length,
            data: {
                videos,
            },
        })
    } catch (error) {
        return next(error)
    }
}

getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                video,
            },
        })
    } catch (error) {
        console.log(error)
        if (error.message.startsWith('Cast to ObjectId failed for value')) {
            return next(new AppError('No video found with that id', 404))
        }
        next(error)
    }

}

createVideo = async (req, res, next) => {
    try {
        const video = await Video.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                video: video,
            },
        })
    }
    catch (error) {
        return next(new AppError(error.message, 404))
    }
}

updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!video) {
            return next(new AppError('No video found with that id', 404))
        }
        res.status(201).json({
            status: 'success',
            data: {
                video,
            },
        })
    } catch (error) {
        if (error.message.startsWith('Cast to ObjectId failed for value')) {
            return next(new AppError('No video found with that id', 404))
        }
        return next(error)
    }
}

deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id)
        if (!video) {
            return next(new AppError('No video found with that id', 404))
        }
        res.status(204).json({
            status: 'success',
            message: 'deleted successfully',
        })
    } catch (error) {
        if (error.message.startsWith('Cast to ObjectId failed for value')) {
            return next(new AppError('No video found with that id', 404))
        }
        return next(error)
    }
}

module.exports = { getAllVideos, getVideo, createVideo, updateVideo, deleteVideo }