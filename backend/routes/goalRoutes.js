const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.post("/", goalController.createGoal);
router.get("/", goalController.getGoals);
router.put("/:id", goalController.updateGoal);
router.delete("/:id", goalController.deleteGoal);

module.exports = router;