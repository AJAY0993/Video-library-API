const AppError = require('../utils/appError')
const Playlist = require('../models/playlistModel')

//index route for get request to read all playlist
async function getAllPlaylists(req, res, next) {
    try {
        const playlists = await Playlist.find().populate('videos')
        res.status(200).json({
            status: 'success',
            data: { playlists }
        })
    }
    catch (err) {
        next(err)
    }
}

//index route for post request to create a new playlist
async function createPlaylist(req, res, next) {
    try {
        const { name, videos } = req.body;
        if (name === 'liked' || name === 'watchlater' || name === 'disliked') return next(new AppError('Please choose some other name'), 400)
        const userid = req.user.id
        const playlist = await (await Playlist.create({ name, videos, userid })).populate('videos')
        res.status(201).json({ status: 'success', data: { playlist } });
    }
    catch (err) {
        return next(err)
    }
}

//read a playlist by id
async function getPlaylistById(req, res, next) {
    try {
        const playlistId = req.params.playlistId
        const userId = req.user.id

        const playlist = await Playlist.findOne({ _id: playlistId, userid: userId }).populate('videos');
        if (!playlist) return next(new AppError('No Playlist found with that ID', 404));

        res.status(200).json({
            status: 'success',
            data: { playlist },
        })
    }
    catch (err) {
        next(err)
    }

}

//delete a playlist by id
async function deletePlaylistById(req, res, next) {
    const id = req.params.playlistId
    const playlist = await Playlist.findByIdAndDelete(id.trim());
    if (!playlist) return next(new AppError('No Playlist found with that ID', 404));

    try {
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
    catch (err) {
        next(err)
    }

}


async function addVideoToPlaylist(req, res, next) {
    try {
        const playlistId = req.params.playlistId.trim()
        const { videoId } = req.body
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return next(new AppError('No Playlist found with that ID', 404));

        const indexOfVid = playlist.videos.indexOf(videoId);

        if (indexOfVid !== -1) return next(new AppError('Video already exist in the playlist'), 400);

        playlist.videos.push(videoId)
        await playlist.save()

        res.status(201).json({
            status: 'success',
            data: { playlist }
        });
    }
    catch (err) {
        next(err)
    }

}

async function removeVideoFromPlaylist(req, res, next) {
    try {
        const playlistId = req.params.playlistId
        const { videoId } = req.body

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return next(new AppError('No Playlist found with that ID', 404));

        const indexOfVid = playlist.videos.indexOf(videoId);

        if (indexOfVid === -1) return next(new AppError('Video does not exist in the playlist'), 400);

        playlist.videos = playlist.videos.filter(id => id != videoId)
        await playlist.save()

        res.status(201).json({
            status: 'success',
            data: { playlist }
        });
    }
    catch (err) {
        next(err)
    }

}

module.exports = { getAllPlaylists, createPlaylist, deletePlaylistById, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist }