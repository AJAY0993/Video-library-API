const catchAsync = require("../utils/catchAsync")

const getUserHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const history = await History.find({ userid: userId })
})

module.exports = { getUserHistory }