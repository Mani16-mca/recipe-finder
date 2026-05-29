const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  recipeId: {
    type: Number,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
commentSchema.index({ recipeId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);