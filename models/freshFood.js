const mongoose = require('mongoose');

const freshFoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
// 食物名稱
  },
  calories: {
    type: Number,
    required: true,
// 每100克食物的熱量（卡路里）
  },
  protein: {
    type: Number,
    required: true,
// 每100克食物中的蛋白質（克）
  },
  fat: {
    type: Number,
    required: true,
// 每100克食物中的脂肪（克）
  },
  carbs: {
    type: Number,
    required: true,
// 每100克食物中的碳水化合物（克）
  },
  maxIntake: {
    type: Number,
    required: true,
// 每日最大攝取量（克）
  },
  note: {
    type: String,
    required: true,
// 食用備註
  },
  nutrition: {
    type: String,
    required: true,
// 營養價值
  },
}, { timestamps: true });

const FreshFood = mongoose.model('FreshFood', freshFoodSchema);

module.exports = FreshFood;