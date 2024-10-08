
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//1)  GLOBAL MIDDLEWARES
//    Set security HTTP headers
app.use(helmet());

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit:'10kb' }));

// Data Sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data Sanitization against  XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
         'ratingsAverage',
         'maxGroupSize',
         'difficulty',
         'price'
    ]
 })
);

//Serving static files
app.use(express.static(`${__dirname}/starter/public`));

// Test Middleware
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});


//app.route('/api/v1/users').get(getAllUsers).post(createUser);
//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*',(req,res,next)=>{
    
    // const err = new Error(`can not find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode=404;
    // next(err);
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));


});

app.use(globalErrorHandler);

module.exports=app;

