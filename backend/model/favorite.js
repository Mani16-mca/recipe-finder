const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Number, required: true },
  title:    { type: String },
  image:    { type: String },
  time:     { type: String },
  ingredients: { type: Number },
  category: { type: String },
  isVeg:    { type: Boolean },
}, { timestamps: true });

// One favorite per user per recipe
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
