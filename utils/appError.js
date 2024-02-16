class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.status = statusCode < 500 ? 'failed' : 'error';
        this.statusCode = statusCode;
        this.operational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError