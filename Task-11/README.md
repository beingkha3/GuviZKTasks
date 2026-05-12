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

## How to Use with Postman

1. Open Postman.
2. Click **Import** → upload `postman_collection.json` from this folder.
3. Set `{{base_url}}` to your deployed URL (`https://task-11-vmjw.onrender.com`).
4. Run the requests in order:
   - **Create Recipe** → auto-saves the recipe `_id` as `{{recipe_id}}`
   - **Get All Recipes** → lists every recipe
   - **Get Recipe By ID** → fetches a single recipe
   - **Update Recipe** → updates fields (servings, prep time, etc.)
   - **Delete Recipe** → removes the recipe

## Deployment

Deployed on Render: [https://task-11-vmjw.onrender.com](https://task-11-vmjw.onrender.com)
