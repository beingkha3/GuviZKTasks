# Recipes API

A CRUD API for managing recipes. Built with Node.js, Express, and Mongoose following the MVC pattern.

## Folder Structure

```
Task-11/
├── server.js              # Entry point
├── package.json
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── Recipe.js          # Mongoose schema
├── controllers/
│   └── recipeController.js # Route handlers
├── routes/
│   └── recipeRoutes.js    # Express routes
├── middleware/
│   └── errorHandler.js    # Error handling
└── views/
    └── index.html         # API info page
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/recipes | Create a recipe |
| GET | /api/recipes | Get all recipes |
| GET | /api/recipes/:id | Get a recipe by ID |
| PUT | /api/recipes/:id | Update a recipe by ID |
| DELETE | /api/recipes/:id | Delete a recipe by ID |

## Sample Request Body

```json
{
  "name": "Butter Chicken",
  "ingredients": ["chicken", "butter", "cream", "tomatoes", "spices"],
  "instructions": "Marinate chicken. Cook in butter with spices. Add cream and simmer.",
  "cuisine": "Indian",
  "prepTime": 20,
  "cookTime": 30,
  "servings": 4
}
```

## How to Run Locally

```bash
npm install
cp .env.example .env   # add your MONGO_URI
npm start
```

The server starts on port 5000 by default.

## Postman Documentation

Published docs (all 5 endpoints with sample requests/responses):

[https://www.postman.com/beingkha3-2637696/guvi-task-11/collection/3l9o29z/recipes-api](https://www.postman.com/beingkha3-2637696/guvi-task-11/collection/3l9o29z/recipes-api?action=share&creator=54783568)

Set `{{base_url}}` to `https://task-11-vmjw.onrender.com` and run requests in order: Create → auto-saves `recipe_id` → Get All → Get By ID → Update → Delete.

## Deployment

Deployed on Render: [https://task-11-vmjw.onrender.com](https://task-11-vmjw.onrender.com)
