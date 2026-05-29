const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getDashboard, getAllUsers, createUser, updateUserRole, deleteUser, getAllReviews } = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.get("/reviews", getAllReviews);
router.post("/users", createUser);
router.put("/users/:id", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
