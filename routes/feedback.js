//寫入mongoDB的CRUD API_ feedbacks collection
const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const handleSuccess = require("../utils/handleSuccess");
const handleErrorAsync = require("../utils/handleErrorAsync");
const appError = require("../utils/appError");


// 新增 feedback
router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const { contactPerson, phone, email, feedback } = req.body;

    // 必填欄位驗證
    if (!contactPerson || !email || !feedback) {
      // 使用 appError 函式創建錯誤物件
      // 狀態碼為 400，錯誤訊息為 "姓名、信箱、內容為必填欄位"
      return next(appError(400, "姓名、信箱、內容為必填欄位"));
    }

    const newFeedback = await Feedback.create({
      contactPerson,
      phone,
      email,
      feedback,
    });

    // 使用 handleSuccess 函式處理成功回應
    // 狀態碼為 201，回應中包含新創建的 feedback 資料和成功訊息
    handleSuccess(res, newFeedback, "新增成功", 201);
  })
  /*  #swagger.tags = ['Feedback']
	    #swagger.summary = '新增回饋'
	    #swagger.description = '新增回饋'
	    #swagger.parameters['body'] = {
	        in: 'body',
	        required: true,
	        schema:{
	            $contactPerson:'姓名',
	            $phone:'電話',
	            $email: '信箱',
	            $feedback: '內容',
	            $source: '從哪裡得知此網站',
	        }
	    }
	*/
);

// 取得所有 feedback
router.get("/", async (req, res) => {
  try {
    // 使用 find() 方法從資料庫中取得所有 feedbacks
    const feedbacks = await Feedback.find();

    // 成功取得資料後，回應 200 狀態碼和回傳的資料
    res.status(200).json({
      status: "success", // 狀態為成功
      results: feedbacks.length, // 回傳的 feedbacks 數量
      data: feedbacks, // 回傳所有 feedbacks 的資料
    });
  } catch (error) {
    // 如果發生錯誤（如資料庫連接問題），回應 404 錯誤狀態和錯誤訊息
    res.status(404).json({
      status: "fail", // 狀態為失敗
      message: error.message, // 返回錯誤訊息
    });
  }
});

// 取得指定 id feedback
router.get("/:id", async (req, res) => {
  try {
    // 使用 findById 方法從資料庫中取得指定 id 的 feedback
    const feedback = await Feedback.findById(req.params.id);

    // 如果找不到該 id 對應的資料，回應 404 錯誤狀態和錯誤訊息
    if (!feedback) {
      return res.status(404).json({
        status: "fail", // 狀態為失敗
        message: "找不到該 feedback", // 返回錯誤訊息
      });
    }

    // 成功取得資料後，回應 200 狀態碼和回傳的資料
    res.status(200).json({
      status: "success", // 狀態為成功
      data: feedback, // 回傳指定 id 的 feedback 資料
    });
  } catch (error) {
    // 如果發生錯誤（如無效的 id），回應 404 錯誤狀態和錯誤訊息
    res.status(404).json({
      status: "fail", // 狀態為失敗
      message: error.message, // 返回錯誤訊息
    });
  }
});

// 更新指定 id feedback
router.patch("/:id", async (req, res) => {
  try {
    // 檢查必填欄位是否存在
    const { contactPerson, email, feedback } = req.body;
    if (!contactPerson || !email || !feedback) {
      return res.status(400).json({
        status: "fail",
        message: "姓名、信箱、內容為必填欄位",
      });
    }

    // 使用 findByIdAndUpdate 更新資料
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id, // 從 URL 參數中獲取要更新的資料 ID
      req.body, // 使用請求 body 中的資料進行更新
      {
        new: true, // 返回更新後的資料
        runValidators: true, // 在更新時執行驗證
      }
    );

    // 如果找不到該資料，回應 404 錯誤
    if (!updatedFeedback) {
      return res.status(404).json({
        status: "fail",
        message: "找不到該 feedback",
      });
    }

    // 成功更新後回應 200 狀態和更新後的資料
    res.status(200).json({
      status: "success",
      data: updatedFeedback,
    });
  } catch (error) {
    // 捕獲錯誤並返回 400 錯誤狀態和錯誤信息
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});
// 刪除指定 id feedback
router.delete("/:id", async (req, res) => {
  try {
    // 使用 findByIdAndDelete 根據 URL 中的 id 參數查找並刪除對應的 feedback
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    // 如果找不到對應的 feedback（即該 id 不存在），回應 404 錯誤
    if (!feedback) {
      return res.status(404).json({
        status: "fail", // 狀態為失敗
        message: "找不到該 feedback", // 返回錯誤訊息
      });
    }

    // 如果成功刪除，回應 200 狀態碼，表示成功操作
    res.status(200).json({
      status: "success", // 狀態為成功
      message: "刪除成功", // 返回成功訊息
      data: null, // 雖然此處用 200，但不返回具體的資料，data 設為 null
    });
  } catch (error) {
    // 如果發生錯誤（例如無效的 id），回應 400 錯誤狀態
    res.status(400).json({
      status: "fail", // 狀態為失敗
      message: error.message, // 返回錯誤訊息，通常是錯誤的詳細信息
    });
  }
});
module.exports = router;