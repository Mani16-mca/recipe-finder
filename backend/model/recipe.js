const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeId:    { type: Number, required: true, unique: true },
  title:       { type: String, required: true },
  image:       { type: String },
  time:        { type: String },
  cookingTime: { type: Number },
  ingredients: { type: Number },
  category:    { type: String },
  author:      { type: String, default: "Unknown" },
  isVeg:       { type: Boolean, default: true },
  description: { type: String },
  ingredientsList: [{ type: String }],
  steps:       [{ type: String }],
  status:      { type: String, enum: ["Published", "Pending", "Draft"], default: "Draft" },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
