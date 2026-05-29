const express = require("express");
const router = express.Router();
const { getAllRecipes, getRecipeById, searchRecipes, createRecipe, updateRecipe, deleteRecipe, getComments, createComment, deleteComment } = require("../controllers/recipeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllRecipes);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);

// Comment routes
router.get("/:id/comments", getComments);
router.post("/:id/comments", protect, createComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

// Admin only — CRUD
router.post("/", protect, adminOnly, createRecipe);
router.put("/:id", protect, adminOnly, updateRecipe);
router.delete("/:id", protect, adminOnly, deleteRecipe);
module.exports = router;
