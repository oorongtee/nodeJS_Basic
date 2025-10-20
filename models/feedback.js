const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // 名稱
    contactPerson: { type: String, required: [true, "姓名未填寫"] },
    // 電話
    phone: { type: String },
    // 信箱
    email: { type: String, required: [true, "信箱未填寫"] },
    // 內容
    feedback: { type: String, required: [true, "內容未填寫"] },
    // 從哪裡得知此網站
    source: {
      type: String,
      enum: ["網路搜尋", "社群媒體", "親友介紹", "其他"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;