var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongodb = require("mongoose")
const cors = require("cors")
const bodyParser = require('body-parser');

require('dotenv').config({path: __dirname + '/.env'})

//Routes is followign 
var buyerRouter = require('./routes/buyerRoutes');
var postRouter = require('./routes/postRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));


// Monodb connection
mongodb.set('strictQuery',false);
mongodb.connect(process.env.db_Connection, { useNewUrlParser: true })
.then(() => console.log("Connected to Mongo...."))
.catch((error) => console.log(error.message));


app.use('/bespoke', buyerRouter);
app.use('/bespoke', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
