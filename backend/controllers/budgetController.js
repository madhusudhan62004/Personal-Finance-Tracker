const Budget = require("../models/Budget");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createBudget = async (req, res) => {
  try {
    const { userCategoryID, limitAmount, startDate, endDate } = req.body;
    const userId = req.session.userId;

    const budgetId = await Budget.create({
      UserID: userId,
      UserCategoryID: userCategoryID,
      LimitAmount: limitAmount,
      StartDate: startDate,
      EndDate: endDate,
    });

    return successResponse(res, {
      message: "Budget created successfully",
      budgetId
    }, 201);
  } catch (error) {
    return errorResponse(res, "Failed to create budget: " + error.message, 500);
  }
};

const getBudgets = async (req, res) => {
  try {
    const userId = req.session.userId;
    const budgets = await Budget.getByUserId(userId);
    return successResponse(res, { budgets });
  } catch (error) {
    return errorResponse(res, "Failed to get budgets: " + error.message, 500);
  }
};

const getCurrentBudgets = async (req, res) => {
  try {
    const userId = req.session.userId;
    const budgets = await Budget.getCurrentBudgets(userId);
    return successResponse(res, { budgets });
  } catch (error) {
    return errorResponse(res, "Failed to get current budgets: " + error.message, 500);
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const deleted = await Budget.delete(id, userId);
    if (!deleted) {
      return errorResponse(res, "Budget not found or not authorized", 404);
    }
    return successResponse(res, { message: "Budget deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to delete budget: " + error.message, 500);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getCurrentBudgets,
  deleteBudget
};
