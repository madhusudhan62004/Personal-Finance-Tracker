const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.get("/recent", transactionController.getRecentTransactions);
router.get("/summary", transactionController.getTransactionSummary);
router.delete("/:id", transactionController.deleteTransaction);
module.exports = router;