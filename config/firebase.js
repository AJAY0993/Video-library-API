const admin = require('firebase-admin')
const serviceAccount = require('./../video-library-a-firebase-adminsdk-rd7l1-fcd9c197d7.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: process.env.FIREBASE_DB })
module.exports = admin