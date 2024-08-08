
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1)  GLOBAL MIDDLEWARES

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});


//app.route('/api/v1/users').get(getAllUsers).post(createUser);
//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next)=>{
    
    // const err = new Error(`can not find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode=404;
    // next(err);
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));


});

app.use(globalErrorHandler);

module.exports=app;

