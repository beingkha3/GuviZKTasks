# Task-13 — Secure Password Reset Flow

A complete, secure password reset workflow built with Node.js, Express, MongoDB, React, and Bootstrap 5.

## Features

- **Forgot Password** — user submits their email; API generates a cryptographically secure token, stores only its SHA-256 hash in the database, and emails a one-time reset link.
- **Token Verification** — before showing the reset form, the frontend calls the API to validate and check expiry.
- **Reset Password** — strong-password form with a live checklist; on success the token fields are cleared to prevent reuse.
- **Generic responses** — forgot-password always returns the same message to prevent account enumeration.
- **Responsive Bootstrap 5 UI** — Forgot Password, Reset Password, and Login handoff screens with loading states and inline alerts.

## Folder Structure

```
Task-13/
├── server.js               # Entry point (Express + CORS + routes)
├── package.json
├── .env.example
├── config/
│   └── db.js               # Mongoose connection
├── models/
│   └── User.js             # User schema (password hashed with bcryptjs)
├── controllers/
│   └── authController.js   # forgotPassword, verifyResetToken, resetPassword
├── routes/
│   └── authRoutes.js
├── services/
│   └── emailService.js     # nodemailer with console/SMTP transport switch
├── utils/
│   └── resetToken.js       # crypto.randomBytes + SHA-256 hashing
├── middleware/
│   ├── errorHandler.js
│   └── validate.js         # express-validator rules
├── postman_collection.json
├── views/
│   └── index.html          # Static API info page
└── client/                 # React + Bootstrap frontend
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── passwordResetApi.js
        ├── utils/
        │   └── password.js         # strength checks
        ├── components/
        │   ├── AuthFrame.jsx        # shared two-column layout
        │   ├── LoadingButton.jsx
        │   ├── SiteNavbar.jsx
        │   └── StatusAlert.jsx
        └── pages/
            ├── ForgotPasswordPage.jsx
            ├── ResetPasswordPage.jsx
            └── LoginPage.jsx        # post-reset handoff
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/forgot-password` | Email a reset link (generic response) |
| GET | `/api/auth/reset-password/:token` | Validate token + expiry |
| POST | `/api/auth/reset-password/:token` | Set new password, clear token |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/forgot-password` | Email submission form |
| `/reset-password/:token` | Token check + new password form |
| `/login` | Post-reset confirmation handoff |

## Security Notes

- Raw token is emailed; the database stores only a SHA-256 hash.
- Token expires in 15 minutes (configurable via `RESET_TOKEN_EXPIRY_MINUTES`).
- Token is cleared immediately after a successful reset (one-use).
- Passwords are hashed with bcryptjs at cost factor 12.

## Password Policy

Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.

## How to Run Locally

**Backend:**

```bash
cd Task-13
npm install
cp .env.example .env   # fill in MONGO_URI and optionally SMTP settings
npm start
```

**Frontend:**

```bash
cd Task-13/client
npm install
cp .env.example .env   # set VITE_API_URL if needed
npm run dev
```

The API starts on port 5000. The client runs on Vite's default port 5173.

For local development, set `EMAIL_TRANSPORT=console` in the API `.env` — the reset URL will be printed to the server log instead of sent by email.

## Postman Collection

Import `postman_collection.json` and set `{{base_url}}` to `http://localhost:5000`.

1. Run **Forgot Password** — copy the token printed to the server log.
2. Set `{{reset_token}}` in your environment.
3. Run **Verify Reset Token** to confirm the link is valid.
4. Run **Reset Password** with the token to set a new password.
