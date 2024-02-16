const jwt = require('jsonwebtoken')

const genToken = (userid, useremail) => jwt.sign({ id: userid, email: useremail }, process.env.JWT_SECRET, { expiresIn: '3d' })

module.exports = genToken 