const AppError = require('../utils/appError')
const Playlist = require('../models/playlistModel')

//index route for get request to read all playlist
async function getAllPlaylists(req, res, next) {
    try {
        const playlists = await Playlist.find().populate('videos')
        res.status(200).json(playlists)
    }
    catch (err) {
        next(new AppError(err.message, 404))
    }
}

//index route for post request to create a new playlist
async function createPlaylist(req, res, next) {
    try {
        const { name, videos, userid } = req.body;
        const playlist = await Playlist.create(req.body)
        res.status(201).json({ status: 'success', data: playlist });
    }
    catch (err) {
        return next(new AppError(err.message, 400))
    }
}

//read a playlist by id
async function getPlaylistById(req, res, next) {
    try {
        const playlistId = req.params.playlistId
        const { userId } = req.body
        const playlist = await Playlist.find({ _id: playlistId, userid: userId }).populate('videos');
        res.status(200).json({
            status: 'success',
            data: playlist,
        })
    }
    catch (err) {
        if (err.name === 'CastError') {
            return next(new AppError('No Playlist found with that ID', 404));
        }
        next(err)
    }

}

//delete a playlist by id
async function deletePlaylistById(req, res, next) {
    const id = req.params.playlistId
    const playlist = await Playlist.findByIdAndDelete(id.trim());
    try {
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
    catch (err) {
        if (err.name === 'CastError') {
            return next(new AppError('No Playlist found with that ID', 404));
        }
        next(err)
    }

}


async function addVideoToPlaylist(req, res, next) {
    try {
        const playlistId = req.params.playlistId
        const { videoId } = req.body
        const playlist = await Playlist.findByIdAndUpdate(playlistId, { $push: { videos: videoId } }, { new: true });
        res.status(201).json(playlist);
    }
    catch (err) {
        if (err.name === 'CastError') {
            return next(new AppError('No Playlist found with that ID', 404));
        }
        next(err)
    }

}

async function removeVideoFromPlaylist(req, res, next) {
    try {
        const playlistId = req.params.playlistId
        const { videoId, userId } = req.body

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { videos: videoId } },
            { new: true });

        res.status(201).json(playlist);
    }
    catch (err) {
        if (err.name === 'CastError') {
            return next(new AppError('No Playlist found with that ID', 404));
        }
        next(err)
    }

}

module.exports = { getAllPlaylists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylistById, getPlaylistById }