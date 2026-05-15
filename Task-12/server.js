require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is required');
  process.exit(1);
}

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is running',
    endpoints: {
      register: { method: 'POST', url: '/api/auth/register' },
      login: { method: 'POST', url: '/api/auth/login' },
      getProfile: { method: 'GET', url: '/api/auth/me', auth: 'Bearer token' },
    },
  });
});

app.use('/api/auth', authRoutes);

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
