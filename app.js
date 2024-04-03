const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const videoRouter = require("./routes/videoRoutes")
const userRouter = require("./routes/userRoutes.js")
const playlistRouter = require("./routes/playlistRoutes.js")
const commentRouter = require("./routes/commentsRoutes.js")
const AppError = require("./utils/appError.js")
const errorController = require("./controllers/errorController.js")

const app = express()

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(helmet())
app.use(cors())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log(req.originalUrl)
  next()
})

// 3) ROUTES
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)

console.log(process.env.NODE_ENV)
app.all("*", (req, res, next) => {
  const err = new AppError(`Cant't find ${req.originalUrl} on this server`, 404)
  next(err)
})

app.use(errorController)

module.exports = app
