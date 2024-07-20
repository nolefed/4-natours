
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1)  MIDDLEWARES

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`));

app.use((req,res,next) =>{
    console.log('Hello from the middleware');
    next();
});

app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});


//app.route('/api/v1/users').get(getAllUsers).post(createUser);
//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports=app;

