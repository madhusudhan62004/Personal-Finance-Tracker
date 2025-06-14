const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/", categoryController.getAllCategories);
router.get("/user", requireAuth, categoryController.getUserCategories);
router.post("/user", requireAuth, categoryController.addUserCategory);

module.exports = router;