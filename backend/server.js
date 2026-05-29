require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const { seedRecipes } = require("./controllers/recipeController");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("CookFinder API running"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealplan", mealPlanRoutes);
app.use("/api/favorites", favoriteRoutes);

const PORT = process.env.PORT || 5000;




mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(`\n✅ ✅ ✅ MongoDB connected successfully: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    await seedRecipes();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 🚀 🚀 SERVER IS RUNNING ON PORT ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`✨ Ready to accept requests!\n`);
    });
  })
  .catch((err) => {
    console.error(`\n❌ ❌ ❌ MongoDB Connection Failed!`);
    console.error(`Error: ${err.message}`);
    console.error(`\n⚠️  Make sure MongoDB is running:`);
    console.error(`   Run: mongod`);
    console.error(`\n🔍 Troubleshooting:`);
    console.error(`   - Check if MongoDB is installed`);
    console.error(`   - Verify MONGO_URI in .env file`);
    console.error(`   - Ensure MongoDB service is running on port 27017\n`);
    process.exit(1);
  });
