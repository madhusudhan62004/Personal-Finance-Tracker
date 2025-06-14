const { errorResponse } = require("../utils/apiResponse");

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return errorResponse(res, "Authentication required", 401);
  }
  next();
};

module.exports = { requireAuth };