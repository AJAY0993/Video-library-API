const Playlist = require('../models/playlistModel');
const User = require('../models/userModel');
const { findById } = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


const getUserProfile = async (req, res, next) => {
    try {
        const id = req.user.id
        const user = await User.findById(id)
        if (!user) return next(new AppError('User does not exist anymore'), 400)
        return res.status(201).json({
            status: 'success',
            data: { user }
        })
    }
    catch (err) {
        return next(new AppError('something went wrong', 500))
    }
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
const getUser = (req, res, err) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
const createUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({ status: 'success', newUser });
    }
    catch (err) {
        next(err)
    }
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const updateUserProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const { username, firebaseToken, email } = req.body
    const updation = {}
    if (username) updation.username = username
    if (email) updation.email = email
    if (firebaseToken) updation.firebaseToken = firebaseToken
    const updatedUser = await User.findByIdAndUpdate(userId, updation, { new: true })
    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
            updatedUser
        }
    })
})
//history handlers
const getHistory = async (req, res, next) => {
    const id = req.user.id
    const user = await User.findById(id).populate('history')
    res.status(200).json({
        status: 'success',
        message: 'history fetched successfully',
        data: { history: user.history }
    })
}

const addVideoToHistory = async (req, res, next) => {
    const { videoId } = req.body
    await User.findByIdAndUpdate(req.user.id, { $pull: { history: videoId } })
    const user = await User.findByIdAndUpdate(req.user.id, { $push: { history: videoId } }, { new: true }).populate('history')

    res.status(200).json({
        status: 'success',
        message: 'history updated successfull',
        data: { history: user.history }
    })
}

const removeVideoFromHistory = async (req, res, next) => {
    console.log(req.body)
    const user = await User.findByIdAndUpdate(req.user.id, { $pull: { history: req.body.videoId } }, { new: true }).populate('history')
    res.status(200).json({
        status: 'success',
        message: 'video removed successfully',
        data: { history: user.history }
    })
}

const clearHistory = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { history: [] }, { new: true })
    res.status(200).json({
        status: 'success',
        message: 'history cleared successfully',
        data: { history: [] }
    })
}

module.exports = {
    getAllUsers, getUser, createUser, updateUser, deleteUser, getUserProfile, updateUserProfile, getHistory, addVideoToHistory, clearHistory, removeVideoFromHistory,
}