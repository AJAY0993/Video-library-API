const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const logger = require('morgan')
const videoRouter = require('./routes/videoRoutes');
const userRouter = require('./routes/userRoutes.js');
const playlistRouter = require('./routes/playlistRoutes.js')
const AppError = require('./utils/appError.js');
const errorController = require('./controllers/errorController.js');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors())
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(logger('dev'))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.originalUrl)
    next();
});


// 3) ROUTES
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/playlists', playlistRouter);

app.all('*', (req, res, next) => {
    const err = new AppError(`Cant't find ${req.originalUrl} on this server`, 404)
    next(err)
})

// app.use(errorController)

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        res.status(409).json({
            status: 'failed',
            message: `${Object.keys(err.keyValue).join(' ')} already exist`,
            err
        })
    }

})

module.exports = app;
