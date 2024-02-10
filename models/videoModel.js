const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A video must have a name']
    },
    category: {
        type: String,
        required: [true, 'A video must have a category']
    },
    embed: {
        type: String,
        required: [true, 'A video must have a embed url']
    },
    duration: {
        type: Number,
        required: [true, 'A video must have a duration']
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'A video must have a discription']
    },
    thumb: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        default: 'no image'
    },
    image: {
        type: String,
        default: 'no image',
    }, uploadDate: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: Math.random() * 1000
    },
    dislikes: {
        type: Number,
        default: Math.random() * 100
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
