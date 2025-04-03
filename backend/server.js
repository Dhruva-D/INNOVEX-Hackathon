const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const donationRoutes = require('./routes/donationRoutes');
const path = require('path');

// Load env vars
dotenv.config();

// Display sanitized MongoDB URI for debugging
const displaySafeMongoURI = () => {
  if (!process.env.MONGODB_URI) {
    return 'MONGODB_URI is not defined in environment variables';
  }
  
  try {
    const uri = process.env.MONGODB_URI;
    // Hide username and password while keeping the structure visible
    const sanitizedURI = uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1***:***@');
    return sanitizedURI;
  } catch (error) {
    return 'Error parsing MongoDB URI';
  }
};

console.log('Connecting to MongoDB:', displaySafeMongoURI());

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/donations', donationRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Food Donation API' });
});

// 404 handler for unknown routes
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 