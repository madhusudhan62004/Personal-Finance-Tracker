const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethodController");

router.get("/", paymentMethodController.getAllPaymentMethods);
router.post("/", paymentMethodController.createPaymentMethod);

module.exports = router;