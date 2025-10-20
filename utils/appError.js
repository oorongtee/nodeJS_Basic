// utils/appError.js

const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.message = errMessage;
  error.statusCode = httpStatus;
  error.isOperational = true;
  return error;
};

module.exports = appError;