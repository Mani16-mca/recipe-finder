const Recipe = require("../model/recipe");
const Comment = require("../model/comment");
const seedData = require("../data/seedRecipes");

const seedRecipes = async () => {
  let inserted = 0;

  for (const recipe of seedData) {
    const existing = await Recipe.findOne({ recipeId: recipe.recipeId });
    if (!existing) {
      await Recipe.create(recipe);
      inserted++;
    } else {
      await Recipe.findOneAndUpdate(
        { recipeId: recipe.recipeId },
        recipe,
        { returnDocument: "after" }
      );
    }
  }

  const all = await Recipe.find().sort({ recipeId: 1 });
  const seedIds = seedData.map(r => r.recipeId);
  const manual = all.filter(r => !seedIds.includes(r.recipeId));

  if (inserted > 0) console.log(`✅ Seeded ${inserted} new recipes`);
  console.log(`📦 Total in database: ${all.length} (seed: ${seedData.length} | manual: ${manual.length})`);
  if (manual.length > 0) {
    manual.forEach(r => console.log(`   🖊️  Manual: [${r.recipeId}] ${r.title}`));
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ recipeId: 1 });
    console.log(`📦 Fetched ${recipes.length} recipes from database`);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    let recipe;
    // Try to find by _id first (MongoDB ObjectId), then by recipeId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      recipe = await Recipe.findById(req.params.id);
    } else {
      recipe = await Recipe.findOne({ recipeId: req.params.id });
    }
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    console.log(`👁️  Recipe viewed: [${recipe.recipeId}] ${recipe.title}`);
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const last = await Recipe.findOne().sort({ recipeId: -1 });
    const nextId = (last?.recipeId || 0) + 1;
    const recipe = await Recipe.create({ ...req.body, recipeId: nextId });
    console.log(`✅ Recipe created: [${recipe.recipeId}] ${recipe.title}`);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    console.log("Updating recipe with ID:", req.params.id);
    console.log("Update data:", req.body);
    
    let recipe;
    // Try to find by _id first (MongoDB ObjectId), then by recipeId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    } else {
      recipe = await Recipe.findOneAndUpdate(
        { recipeId: req.params.id }, req.body, { returnDocument: "after" }
      );
    }
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    
    console.log(`🔄 Recipe updated: [${recipe.recipeId}] ${recipe.title} - Status: ${recipe.status}`);
    res.json(recipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    let recipe;
    // Try to find by _id first (MongoDB ObjectId), then by recipeId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      recipe = await Recipe.findByIdAndDelete(req.params.id);
    } else {
      recipe = await Recipe.findOneAndDelete({ recipeId: req.params.id });
    }
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    console.log(`🗑️  Recipe deleted: [${recipe.recipeId}] ${recipe.title}`);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment functions
const getComments = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const comments = await Comment.find({ recipeId })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`💬 Fetched ${comments.length} comments for recipe ${recipeId}`);
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const { comment, rating } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!comment || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Comment and rating (1-5) are required" });
    }

    // Get user details
    const User = require("../model/user");
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recipe exists
    const recipe = await Recipe.findOne({ recipeId });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Create comment
    const newComment = await Comment.create({
      recipeId,
      userId,
      userName: user.name,
      comment: comment.trim(),
      rating
    });

    console.log(`💬 Comment created for recipe ${recipeId} by ${user.name}`);
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    
    // Get user details for logging
    const User = require("../model/user");
    const user = await User.findById(userId);
    console.log(`🗑️ Comment deleted by ${user ? user.name : 'Unknown'}`);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seedRecipes, getAllRecipes, getRecipeById, searchRecipes, createRecipe, updateRecipe, deleteRecipe, getComments, createComment, deleteComment };
