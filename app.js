var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");//swagger製作api文件

const cors = require('cors');// 引入 CORS 套件

const { v4: uuidv4 } = require('uuid');
console.log(uuidv4()); // 輸出類似：'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const feedbackRoute = require("./routes/feedback");
const freshFoodRoute = require("./routes/freshFood");

const mongoose = require("mongoose");// 導入 mongoose 套件使用

// 將 .env 檔案中的變數載入到 process.env 中
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

var app = express();

// 程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(err);
  process.exit(1);
});

// 宣告 DB 常數，將 <password> 字串替換為 .env 檔案內的 DATABASE_PASSWORD (就是我們的資料庫用戶密碼)
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

// 連接資料庫
mongoose
  .connect(DB)
  .then(() => console.log("資料庫連接成功")) // 連接成功會看到 log("資料庫連接成功")
  .catch((err) => {
    console.log("MongoDB 連接失敗:", err); // 反之，捕捉錯誤並 log 顯示錯誤原因
  });

const Feedback = require("./models/feedback");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/feedbacks", feedbackRoute);
app.use("/freshfoods", freshFoodRoute);

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: "error",
    message: "無此路由資訊",
    path: req.originalUrl,
  });
});

// * 開發環境 錯誤處理
const resError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resError(err, res);
  }

  resError(err, res);
});

// 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", err);
});

// 導出給 ./bin/www 使用
module.exports = app;