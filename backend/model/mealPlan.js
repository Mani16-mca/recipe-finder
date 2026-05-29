const mongoose = require("mongoose");

const mealEntrySchema = new mongoose.Schema({
  name:  { type: String, required: true },
  cals:  { type: Number, default: 0 },
  img:   { type: String, default: "" },
  day:   { type: String, required: true }, // Mon, Tue...
  type:  { type: String, required: true }, // Breakfast, Lunch, Dinner
});

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meals:  [mealEntrySchema],
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
