const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

router.route('/')
  .post(createRecipe)
  .get(getAllRecipes);

router.route('/:id')
  .get(getRecipeById)
  .put(updateRecipe)
  .delete(deleteRecipe);

module.exports = router;
