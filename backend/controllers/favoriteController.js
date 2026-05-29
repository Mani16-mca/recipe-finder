const Favorite = require("../model/favorite");

const getFavorites = async (req, res) => {
  try {
    const favs = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { recipeId, title, image, time, ingredients, category, isVeg } = req.body;
    const fav = await Favorite.findOneAndUpdate(
      { userId: req.user.id, recipeId },
      { userId: req.user.id, recipeId, title, image, time, ingredients, category, isVeg },
      { upsert: true, new: true, returnDocument: "after" }
    );
    console.log(`❤️  Favorite added: ${title} by user ${req.user.id}`);
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.user.id, recipeId: req.params.recipeId });
    console.log(`💔 Favorite removed: recipeId ${req.params.recipeId} by user ${req.user.id}`);
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
