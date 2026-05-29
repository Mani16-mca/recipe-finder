const mongoose = require("mongoose");
const Recipe = require("../model/recipe");
require("dotenv").config();

const updateRecipesWithAuthorAndCookingTime = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all recipes
    const recipes = await Recipe.find();
    console.log(`📦 Found ${recipes.length} recipes to update`);

    let updated = 0;
    for (const recipe of recipes) {
      const updateData = {};
      
      // Add author if missing
      if (!recipe.author) {
        updateData.author = "Unknown";
      }
      
      // Add cookingTime if missing
      if (!recipe.cookingTime && recipe.time) {
        // Extract number from time string (e.g., "25 min" -> 25)
        const timeMatch = recipe.time.match(/\d+/);
        if (timeMatch) {
          updateData.cookingTime = parseInt(timeMatch[0]);
        }
      }
      
      // Update if there are changes
      if (Object.keys(updateData).length > 0) {
        await Recipe.findByIdAndUpdate(recipe._id, updateData);
        updated++;
        console.log(`🔄 Updated recipe [${recipe.recipeId}] ${recipe.title}`);
      }
    }

    console.log(`✅ Migration completed! Updated ${updated} recipes`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

updateRecipesWithAuthorAndCookingTime();