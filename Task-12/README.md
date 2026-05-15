# Auth API

User authentication and authorization with JWT Bearer tokens. Built with Node.js, Express, Mongoose, and bcryptjs.

## Folder Structure

```
Task-12/
├── server.js              # Entry point
├── package.json
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js            # User schema with password hashing
├── controllers/
│   └── authController.js  # Register, login, getMe
├── routes/
│   └── authRoutes.js      # Express routes
├── middleware/
│   ├── auth.js            # JWT verification middleware
│   ├── validate.js        # Input validation rules
│   └── errorHandler.js    # Error handling
└── views/
    └── index.html         # API info page
```

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | - | Register a new user |
| POST | /api/auth/login | - | Login, returns JWT |
| GET | /api/auth/me | Bearer | Get current user profile |

## Sample Requests

### Register
```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
```
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

## How to Run Locally

```bash
npm install
cp .env.example .env   # add MONGO_URI and JWT_SECRET
npm start
```

## Postman Documentation

Published docs with all endpoints and examples:

https://www.postman.com/beingkha3-2637696/guvi-task-12/collection/u6a7vbi/auth-api

Set `{{base_url}}` to your deployed Render URL. Run Register or Login first to auto-save the `{{token}}`, then Get Profile uses it automatically.

## Deployment

Deployed on Render: [https://task-12-p7l1.onrender.com](https://task-12-p7l1.onrender.com)
