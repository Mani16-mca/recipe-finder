const mongoose = require("mongoose");
const Recipe = require("../model/recipe");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cookfinder");

const addStatusToRecipes = async () => {
  try {
    console.log("🔄 Adding status field to existing recipes...");
    
    // Update all recipes that don't have a status field
    const result = await Recipe.updateMany(
      { status: { $exists: false } }, // Find recipes without status field
      { $set: { status: "Published" } } // Set default status to Published
    );
    
    console.log(`✅ Updated ${result.modifiedCount} recipes with status field`);
    
    // Show all recipes with their status
    const allRecipes = await Recipe.find({}, { title: 1, status: 1, recipeId: 1 });
    console.log("\n📋 All recipes with status:");
    allRecipes.forEach(recipe => {
      console.log(`   [${recipe.recipeId}] ${recipe.title} - Status: ${recipe.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating recipes:", error);
    process.exit(1);
  }
};

addStatusToRecipes();