const User = require("../model/user");
const Favorite = require("../model/favorite");
const Comment = require("../model/comment");
const Recipe = require("../model/recipe");
const bcrypt = require("bcrypt");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFavorites = await Favorite.countDocuments();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    console.log(`✅ Admin dashboard accessed by: ${req.user.id}`);
    res.json({
      stats: { totalUsers, totalRecipes: 150, pendingReviews: 45, favorites: totalFavorites },
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date(),
    });
    await newUser.save();
    console.log(`✅ User created: ${email}`);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, role: req.body.role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(`✅ User updated: ${user.email} → role: ${user.role}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(`✅ User deleted: ${user.email}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    // Get recipe names for each comment
    const reviewsWithRecipeNames = await Promise.all(
      comments.map(async (comment) => {
        const recipe = await Recipe.findOne({ recipeId: comment.recipeId });
        return {
          _id: comment._id,
          recipeId: comment.recipeId,
          recipeName: recipe ? recipe.title : 'Unknown Recipe',
          userId: comment.userId._id,
          userName: comment.userName,
          userEmail: comment.userId.email,
          rating: comment.rating,
          comment: comment.comment,
          createdAt: comment.createdAt,
          status: 'approved' // Default status for now
        };
      })
    );

    console.log(`📊 Admin fetched ${reviewsWithRecipeNames.length} reviews`);
    res.json(reviewsWithRecipeNames);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard, getAllUsers, createUser, updateUserRole, deleteUser, getAllReviews };
