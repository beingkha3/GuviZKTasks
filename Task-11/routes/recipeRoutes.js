const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const {
  handleErrors,
  createRecipeRules,
  updateRecipeRules,
  idRule,
} = require('../middleware/validate');

const router = express.Router();

router.route('/')
  .post(createRecipeRules, handleErrors, createRecipe)
  .get(getAllRecipes);

router.route('/:id')
  .get(idRule, handleErrors, getRecipeById)
  .put(updateRecipeRules, handleErrors, updateRecipe)
  .delete(idRule, handleErrors, deleteRecipe);

module.exports = router;
