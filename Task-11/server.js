require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Recipes API is running',
    endpoints: {
      createRecipe: { method: 'POST', url: '/api/recipes' },
      getAllRecipes: { method: 'GET', url: '/api/recipes' },
      getRecipeById: { method: 'GET', url: '/api/recipes/:id' },
      updateRecipe: { method: 'PUT', url: '/api/recipes/:id' },
      deleteRecipe: { method: 'DELETE', url: '/api/recipes/:id' },
    },
  });
});

app.use('/api/recipes', recipeRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
