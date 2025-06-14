const Category = require("../models/Category");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    return successResponse(res, { categories });
  } catch (error) {
    return errorResponse(res, "Failed to get categories: " + error.message, 500);
  }
};

const getUserCategories = async (req, res) => {
  try {
    const userId = req.session.userId;
    const categories = await Category.getUserCategories(userId);
    return successResponse(res, { categories });
  } catch (error) {
    return errorResponse(res, "Failed to get user categories: " + error.message, 500);
  }
};

const addUserCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const userId = req.session.userId;

    const userCategoryId = await Category.addUserCategory(userId, categoryId);
    return successResponse(res, {
      message: "Category added to user successfully",
      userCategoryId
    }, 201);
  } catch (error) {
    return errorResponse(res, "Failed to add user category: " + error.message, 500);
  }
};

module.exports = {
  getAllCategories,
  getUserCategories,
  addUserCategory
};