const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'A comment must have a userId'] },
    videoid: { type: mongoose.Schema.ObjectId, ref: 'Video', required: [true, 'A comment must have a VideoId'] },
    comment: {
        type: String,
        required: [true, 'Please enter provide your comment']
    },
    username: String
})

const Comment = mongoose.model('comments', CommentSchema)
module.exports = Comment