const AppError = require("../utils/appError")

const handleDevlopmentError = (err, res) => {
    const statusCode = err.statusCode || 500
    const message = err.message
    const status = err.status || 'error'
    res.status(statusCode).json({
        status: status,
        message: message,
        err: err,
        stack: err.stack
    })
}

const handleproductionError = (err, res) => {
    const statusCode = err.statusCode || 500
    const message = statusCode < 500 ? err.message : 'something went wrong'
    const status = err.status
    res.status(statusCode).json({
        status,
        message
    })
}

const handleCastErrorDB = err => {
    const message = `Invalid value for ${err.path}`
    return new AppError(message, 400)
}

const handleValidationError = err => {
    const errors = Object.values(err.errors)
    const message = errors.map(err => err.message).join(', ')
    return new AppError(message, 400)
}

handleDuplicateFieldError = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleJsonWebTokenError = err => {
    return new AppError('You token is invalid! Please log in again', 401)
}

const handleTokenExpiredError = err => {
    return new AppError('Your token has been expired! Please log in again', 401)
}

const errorController = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'devlopment') {
        handleDevlopmentError(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.message = err.message
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if (err.name === 'ValidationError') {
            error = handleValidationError(error)
        }
        if (err.code === 11000) {
            error = handleDuplicateFieldError(error)
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError()
        }
        if (err.name === 'TokenExpiredError') {
            error = handleTokenExpiredError()
        }
        handleproductionError(error, res)
    }
}

module.exports = errorController

