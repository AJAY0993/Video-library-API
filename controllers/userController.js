const Playlist = require('../models/playlistModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');


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
    const { vidId } = req.body
    await User.findByIdAndUpdate(req.user.id, { $pull: { history: vidId } })
    const user = await User.findByIdAndUpdate(req.user.id, { $push: { history: vidId } }, { new: true }).populate('history')

    res.status(200).json({
        status: 'success',
        message: 'history updated successfull',
        data: { history: user.history }
    })
}

const removeVideoFromHistory = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { $pull: { history: req.body.vidId } }, { new: true }).populate('history')
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

//Playlist handlers
async function getPlaylists(req, res, next) {
    try {
        const userid = req.user.id
        const playlists = await Playlist.find({ userid })
        res.status(200).json({
            status: 'success',
            message: 'Playlist fetched successfully',
            data: {
                playlists: playlists
            }
        })
    } catch (err) {
        next(err)
    }
}
async function createPlaylist(req, res, next) {
    try {
        const { name, videos } = req.body;
        if (name === 'liked' || name === 'watchlater' || name === 'disliked') return next(new AppError('Please choose some other name'), 400)
        const userid = req.user.id
        const playlist = await (await Playlist.create({ name, videos, userid })).populate('videos')
        res.status(201).json({ status: 'success', message: 'Playlist created successfully', data: { playlist } });
    }
    catch (err) {
        return next(err)
    }
}

async function getPlaylistById(req, res, next) {
    try {
        const { playlistId } = req.params
        const playlist = await Playlist.findById(playlistId).populate('videos')
        if (!playlist) return next(new AppError('Invalid Id', 400))
        res.status(200).json({
            status: 'success', message: 'Playlist fetched successfully', data: {
                playlist
            }
        })
    } catch (err) {
        next(err)
    }
}

async function deletePlaylistById(req, res, next) {
    try {
        const { playlistId } = req.params
        const userid = req.user.id
        const playlist = await Playlist.findOneAndDelete({ _id: playlistId, userid })
        if (!playlist) return next(new AppError('Invalid Id', 400))
        res.status(204).json({
            status: 'success', message: 'Playlist deleted successfully', data: null
        })
    } catch (err) {
        next(err)
    }
}

async function addVideoToPlaylist(req, res, next) {
    try {
        const userid = req.user.id
        const { playlistId, videoId } = req.params
        let playlist = await Playlist.findOne({ _id: playlistId, userid })
        if (playlist.videos.includes(videoId)) return next(new AppError('Video already exist.', 400));
        playlist = await Playlist.findOneAndUpdate({ userid, _id: playlistId }, { $push: { videos: videoId } }, { new: true }).populate('videos')
        res.status(201).json({
            status: 'success',
            message: 'Video added successfully',
            data: {
                playlist
            }
        })
    } catch (err) {
        next(err)
    }
}

async function removeVideoFromPlaylist(req, res, next) {
    try {
        const userid = req.user.id
        const { playlistId, videoId } = req.params
        const playlist = await Playlist.findOneAndUpdate({ _id: playlistId, userid }, { $pull: { videos: videoId } }, { new: true }).populate('videos')
        console.log(playlist)
        res.status(200).json({
            status: 'success',
            message: 'Video removed successfully',
            data: {
                playlist
            }
        })
    } catch (err) {
        next(err)
    }
}

const getLiked = async (req, res) => {
    try {
        const liked = await Playlist.findOne({ userid: req.user.id, name: 'liked' }).populate('videos')
        res.status(200).json({
            status: 'success',
            message: 'Likes video fetched successfully',
            data: { liked: liked.videos }
        })
    }
    catch (err) {
        next(err)
    }
}

const getWatchLater = async (req, res, next) => {
    const userid = req.user.id
    try {
        const watchLater = await Playlist.findOne({ userid, name: 'watchLater' }).populate('videos');
        if (!watchLater) return next(new AppError('Invalid user'), 400);
        res.status(200).json({
            status: 'success',
            message: 'Likes video fetched successfully',
            data: { watchLater: watchLater.videos }
        })
    }
    catch (err) {
        next(err)
    }
}

const addVideoToWatchLater = async (req, res, next) => {
    const userid = req.user.id
    const videoId = req.params.videoId
    try {
        const userid = req.user.id
        const { videoId } = req.params
        let watchLater = await Playlist.findOne({ userid, name: 'watchLater' })
        if (watchLater.videos.includes(videoId)) return next(new AppError('Video already exist.', 400));
        watchLater = await Playlist.findOneAndUpdate({ userid, name: 'watchLater' }, { $push: { videos: videoId } }, { new: true, upsert: true }).populate('videos')
        res.status(201).json({
            status: 'success',
            message: 'Video added successfully',
            data: {
                watchLater: watchLater.videos
            }
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

const removeVideoFromWatchLater = async (req, res, next) => {
    try {
        const userid = req.user.id
        const { videoId } = req.params
        const watchLater = await Playlist.findOneAndUpdate({ userid, name: 'watchLater' }, { $pull: { videos: videoId } }, { new: true }).populate('videos')
        res.status(200).json({
            status: 'success',
            message: 'Video removed successfully',
            data: {
                watchLater: watchLater.videos
            }
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getAllUsers, getUser, createUser, updateUser, deleteUser, getPlaylists, getUserProfile, getHistory, addVideoToHistory, clearHistory, removeVideoFromHistory, getLiked, getPlaylists, createPlaylist, getPlaylistById, deletePlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, getWatchLater, addVideoToWatchLater, removeVideoFromWatchLater
}