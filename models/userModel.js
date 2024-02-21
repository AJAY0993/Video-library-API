const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')
const Playlist = require('./playlistModel')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    email: {
        type: String,
        unique: [true, 'Account already exist with this account'],
        lowerase: true,
        required: [true, 'A user must have a email'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must 8 characters long'],
        select: false
    },
    playlists: [{ type: ObjectId, ref: 'Playist', default: [] }],
    history: [{ type: ObjectId, ref: 'Video', default: [] }],
    role: {
        type: String,
        enum: ['user', 'admin']
    }, firebaseToken: { type: String }
})

const defaultPlaylists = ['liked', 'disliked', 'watchLater']

//Middleware for hashing the password
UserSchema.pre('save', async function (next) {
    if (this.isNew) this.password = await bcrypt.hash(this.password, 10);
    next()
})

//Middleware for creating the playlists
UserSchema.pre('save', async function (next) {
    if (this.isNew) {
        const playlistPromises = defaultPlaylists.map(async playlist => {
            const newPlaylist = await Playlist.create({
                name: playlist,
                userid: this._id,
                videos: [],
            })
            return newPlaylist._id
        })
        this.playlists = await Promise.all(playlistPromises)
    }
    next()
})

//Middleware for adding role 
UserSchema.pre('save', function (next) {
    if (this.isNew) this.role = 'user';
    next()
})

// Password hash.
UserSchema.methods.isPasswordCorrect = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}

// Password Changed recently funtion
UserSchema.methods.doesPasswordChanged = function (tokenTimeStamp) {
    if (this.passwordChangedAt) {
        return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > tokenTimeStamp
    }
    return false;
}

module.exports = mongoose.model('Users', UserSchema)