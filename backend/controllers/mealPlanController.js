const MealPlan = require("../model/mealPlan");

const getMealPlan = async (req, res) => {
  try {
    let plan = await MealPlan.findOne({ userId: req.user.id });
    if (!plan) {
      // Create empty plan for user
      plan = await MealPlan.create({ userId: req.user.id, meals: [] });
      console.log(`✅ New meal plan created for user: ${req.user.id}`);
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveMealPlan = async (req, res) => {
  try {
    const { meals } = req.body;
    let plan = await MealPlan.findOneAndUpdate(
      { userId: req.user.id },
      { meals },
      { new: true, upsert: true }
    );
    console.log(`✅ Meal plan saved for user: ${req.user.id} (${meals.length} meals)`);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMealPlan, saveMealPlan };
