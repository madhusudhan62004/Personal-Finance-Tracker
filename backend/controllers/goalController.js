const Goal = require("../models/Goal");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline } = req.body;
    const userId = req.session.userId;

    const goalId = await Goal.create({
      UserID: userId,
      Name: name,
      TargetAmount: targetAmount,
      CurrentAmount: currentAmount,
      Deadline: deadline
    });

    return successResponse(res, {
      message: "Goal created successfully",
      goalId
    }, 201);
  } catch (error) {
    return errorResponse(res, "Failed to create goal: " + error.message, 500);
  }
};

const getGoals = async (req, res) => {
  try {
    const userId = req.session.userId;
    const goals = await Goal.getByUserId(userId);
    return successResponse(res, { goals });
  } catch (error) {
    return errorResponse(res, "Failed to get goals: " + error.message, 500);
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const { name, targetAmount, currentAmount, deadline, status } = req.body;

    const updated = await Goal.update(id, userId, {
      Name: name,
      TargetAmount: targetAmount,
      CurrentAmount: currentAmount,
      Deadline: deadline,
      Status: status
    });

    if (!updated) {
      return errorResponse(res, "Goal not found or not authorized", 404);
    }

    return successResponse(res, { message: "Goal updated successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to update goal: " + error.message, 500);
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const deleted = await Goal.delete(id, userId);
    if (!deleted) {
      return errorResponse(res, "Goal not found or not authorized", 404);
    }

    return successResponse(res, { message: "Goal deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to delete goal: " + error.message, 500);
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
};