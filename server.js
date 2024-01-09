const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')
const connectDB = require('./config/database')

connectDB()

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
