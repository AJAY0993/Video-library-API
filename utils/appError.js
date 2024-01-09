class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        const status = statusCode.toString().startsWith('4') ? 'failed' : 'error'
        this.status = status;
        this.statusCode = statusCode
        this.operational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError