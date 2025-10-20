var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');// 引入 CORS 套件

// 將 .env 檔案中的變數載入到 process.env 中
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
console.log(process.env.DB_HOST); // 從 process.env 中讀取並打印 DB_HOST 變數的值 // 這邊會得到 localhost

const { v4: uuidv4 } = require('uuid');
console.log(uuidv4()); // 輸出類似：'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
