const PaymentMethod = require("../models/PaymentMethod");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.getAll();
    return successResponse(res, { paymentMethods });
  } catch (error) {
    return errorResponse(res, "Failed to get payment methods: " + error.message, 500);
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    const { methodName } = req.body;
    const paymentMethodId = await PaymentMethod.create(methodName);
    return successResponse(res, {
      message: "Payment method created successfully",
      paymentMethodId
    }, 201);
  } catch (error) {
    return errorResponse(res, "Failed to create payment method: " + error.message, 500);
  }
};

module.exports = {
  getAllPaymentMethods,
  createPaymentMethod
};