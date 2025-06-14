const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);
router.get("/current", budgetController.getCurrentBudgets);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;