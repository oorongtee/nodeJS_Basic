const express = require("express");
const router = express.Router();
const FreshFood = require("../models/freshFood");
const handleSuccess = require("../utils/handleSuccess");
const handleErrorAsync = require("../utils/handleErrorAsync");
const appError = require("../utils/appError");

// 取得所有 freshFood
router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    // 使用 find() 方法從資料庫中取得所有 freshFoods
    const freshFoods = await FreshFood.find();

    handleSuccess(res, freshFoods, "取得所有 freshFoods 成功", 200);
  })
);

module.exports = router;