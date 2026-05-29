const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMealPlan, saveMealPlan } = require("../controllers/mealPlanController");

router.get("/", protect, getMealPlan);
router.post("/", protect, saveMealPlan);

module.exports = router;
