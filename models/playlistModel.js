const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
    name: { type: String },
    userid: { type: String, required: [true, 'Please provide your userid'] },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
})


const Playlist = mongoose.model('Playlist', PlaylistSchema)


module.exports = Playlist