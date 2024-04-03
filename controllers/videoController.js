const AppError = require("../utils/appError")
const Video = require("../models/videoModel")
const Playlist = require("../models/playlistModel")
const User = require("../models/userModel")

const catchAsync = require("../utils/catchAsync")
const { sendNotificationToAllUsers } = require("../utils/sendNotification")

const getAllVideos = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query }
  const excludedFields = ["page", "sort", "limit", "search"]
  excludedFields.forEach((el) => delete queryObj[el])

  //advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`)

  //build query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12

  const skip = (page - 1) * limit
  const myQuery = JSON.parse(queryStr)
  myQuery.name = { $regex: `.*${req.query.search || ""}.*`, $options: "i" }
  const query = Video.find(myQuery).skip(skip).limit(limit)

  //execute query
  const videos = await query
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    page,
    results: videos.length,
    data: {
      videos
    }
  })
})

const getGenres = (req, res, next) => {
  const genres = [
    {
      name: "Action",
      image: "X8psFT0/action.jpg"
    },
    {
      name: "Drama",
      image: "L0XdQxp/drama.jpg"
    },
    {
      name: "Animation",
      image: "SxmLDPs/animation.jpg"
    },
    {
      name: "Fantasy",
      image: "FnfwrLH/fantasy.jpg"
    },
    {
      name: "Horror",
      image: "nRLKsBJ/horror.jpg"
    },
    {
      name: "Romance",
      image: "gwhs5vP/romance.jpg"
    },
    {
      name: "Science-Fiction",
      image: "qs00bsr/science-fiction.jpg"
    },
    {
      name: "Comedy",
      image: "1QNZXtq/comedy.jpg"
    }
  ]

  res.status(200).json({
    status: "success",
    data: {
      genres
    }
  })
}
const getVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
  if (!video) return next(new AppError("No video found this ID", 400))
  res.status(200).json({
    status: "success",
    data: {
      video
    }
  })
})

const createVideo = catchAsync(async (req, res, next) => {
  const video = await Video.create(req.body)
  const users = await User.find().select("firebaseToken")
  const tokens = users
    .filter((user) => user.firebaseToken)
    .map((user) => user.firebaseToken)
  sendNotificationToAllUsers(tokens, {
    title: "New video",
    body: "Vid Valut added new video to their collection",
    image: video.thumb
  })

  res.status(201).json({
    status: "success",
    data: {
      video: video
    }
  })
})

const updateVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body.video, {
    new: true,
    runValidators: true
  })
  if (!video) {
    return next(new AppError("No video found with that id", 404))
  }
  res.status(201).json({
    status: "success",
    data: {
      video
    }
  })
})

const deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndDelete(req.params.id)
  if (!video) return next(new AppError("No video found with that id", 404))
  res.status(204).json({
    status: "success",
    message: "deleted successfully"
  })
})

const incrementViews = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 }
  })
  if (!video) return next(new AppError("No video found with that id", 404))
  res.status(201).json({
    status: "success",
    data: {
      views: video.views
    }
  })
})

const like = catchAsync(async (req, res, next) => {
  const videoId = req.params.id
  const userid = req.user.id
  const liked = await Playlist.findOne({ name: "liked", userid })
  if (!liked) return next(new AppError("User does not exist anymore"), 400)

  //case 1: If video is liked already by the user
  if (liked.videos.includes(videoId)) {
    //remove it from user's liked playlist
    liked.videos = liked.videos.filter((id) => id != videoId)
    await liked.save()
    //decrement the like count of video by 1
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { likes: -1 } },
      { new: true }
    )

    //send response
    return res.json({
      status: "success",
      message: "video was already liked so it removed the existing like",
      data: { likes: video.likes, dislikes: video.dislikes }
    })
  }
  //case 2: If video is not liked before
  //increment the like count of video by 1
  let video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { likes: 1 } },
    { new: true }
  )
  if (!video) return next(new AppError("No video found with this id", 400))

  // add the video in the user liked playlist
  liked.videos.push(videoId)
  await liked.save()

  const disliked = await Playlist.findOne({ name: "disliked", userid })

  //Remove video from disliked if it was disliked before
  if (disliked.videos.includes(videoId)) {
    disliked.videos = disliked.videos.filter((id) => id != videoId)
    await disliked.save()
    video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { dislikes: -1 } },
      { new: true }
    )
  }

  res.json({
    status: "success",
    message: "Video liked successfully",
    data: { likes: video.likes, dislikes: video.dislikes }
  })
})

const dislike = catchAsync(async (req, res, next) => {
  const videoId = req.params.id
  const userid = req.user.id
  const disliked = await Playlist.findOne({ name: "disliked", userid })
  if (!disliked) return next(new AppError("User does not exist anymore"), 400)

  //case 1: If video is disliked already by the user
  if (disliked.videos.includes(videoId)) {
    //remove it from user's disliked playlist
    disliked.videos = disliked.videos.filter((id) => id != videoId)
    await disliked.save()
    //decrement the like count of video by 1
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { dislikes: -1 } },
      { new: true }
    )

    //send response
    return res.json({
      status: "success",
      message: "video was already disliked so it removed the existing dislike",
      data: { likes: video.likes, dislikes: video.dislikes }
    })
  }
  //case 2: If video is not disliked before
  //increment the like count of video by 1
  let video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { dislikes: 1 } },
    { new: true }
  )
  if (!video) return next(new AppError("No video found with this id", 400))

  // add the video in the user disliked playlist
  disliked.videos.push(videoId)
  await disliked.save()

  const liked = await Playlist.findOne({ name: "liked", userid })

  //Remove video from liked if it was liked before
  if (liked.videos.includes(videoId)) {
    liked.videos = liked.videos.filter((id) => id != videoId)
    await liked.save()
    video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { likes: -1 } },
      { new: true }
    )
  }

  res.json({
    status: "success",
    message: "Video disliked successfully",
    data: { likes: video.likes, dislikes: video.dislikes }
  })
})
module.exports = {
  getAllVideos,
  getGenres,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  like,
  dislike
}
