const { errorResponse } = require("./apiResponse");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  errorResponse(res, "Something went wrong!", 500);
};

module.exports = errorHandler;