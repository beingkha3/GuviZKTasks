const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Ingredients must be a non-empty array',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    cuisine: {
      type: String,
      trim: true,
    },
    prepTime: {
      type: Number,
      min: [0, 'Prep time cannot be negative'],
    },
    cookTime: {
      type: Number,
      min: [0, 'Cook time cannot be negative'],
    },
    servings: {
      type: Number,
      min: [1, 'Servings must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
