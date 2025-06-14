const Transaction = require("../models/Transaction");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createTransaction = async (req, res) => {
  try {
    const { userCategoryID, amount, date, description, paymentMethodID } = req.body;
    const userId = req.session.userId;

    // 1. Create the transaction record
    const transactionId = await Transaction.create({
      UserID: userId,
      UserCategoryID: userCategoryID,
      Amount: amount,
      Date: date,
      Description: description,
    });

    // 2. Create the payment record using the newly created TransactionID.
    const paymentId = await Transaction.createPayment({
      UserID: userId,
      TransactionID: transactionId,
      PaymentMethodID: paymentMethodID,
      PaymentDate: date,
    });

    return successResponse(res, {
      message: "Transaction created successfully",
      transactionId,
    }, 201);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return errorResponse(res, "Failed to create transaction: " + error.message, 500);
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;
    const transactions = await Transaction.getByUserId(userId);
    return successResponse(res, { transactions });
  } catch (error) {
    return errorResponse(res, "Failed to get transactions: " + error.message, 500);
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;
    const transactions = await Transaction.getRecentTransactions(userId);
    return successResponse(res, { transactions });
  } catch (error) {
    return errorResponse(res, "Failed to get recent transactions: " + error.message, 500);
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.session.userId;
    const summary = await Transaction.getSummaryByCategory(userId);
    return successResponse(res, { summary });
  } catch (error) {
    return errorResponse(res, "Failed to get transaction summary: " + error.message, 500);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const deleted = await Transaction.delete(id, userId);
    if (!deleted) {
      return errorResponse(res, "Transaction not found or not authorized", 404);
    }
    return successResponse(res, { message: "Transaction deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to delete transaction: " + error.message, 500);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getRecentTransactions,
  getTransactionSummary,
  deleteTransaction
};
