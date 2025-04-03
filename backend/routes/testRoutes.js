const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @desc    Test database connection
// @route   GET /api/test/db
// @access  Public
router.get('/db', async (req, res) => {
  try {
    // Check if we're connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        success: false, 
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState,
        stateDescription: getReadyStateDescription(mongoose.connection.readyState)
      });
    }
    
    // Display database info
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Try to ping the database
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    
    res.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      dbName,
      collections: collectionNames,
      pingResult,
      readyState: mongoose.connection.readyState,
      stateDescription: getReadyStateDescription(mongoose.connection.readyState),
      host: mongoose.connection.host,
      port: mongoose.connection.port
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// @desc    Test authentication functionality
// @route   GET /api/test/auth
// @access  Public
router.get('/auth', (req, res) => {
  try {
    // Verify environment variables are set
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV
    };
    
    // Check if we have user models
    const userModels = {
      donorModel: !!mongoose.models.Donor,
      foodSeekerModel: !!mongoose.models.FoodSeeker,
      volunteerModel: !!mongoose.models.Volunteer
    };
    
    const modelDetails = {};
    if (mongoose.models.Donor) {
      modelDetails.donorSchema = Object.keys(mongoose.models.Donor.schema.paths);
    }
    if (mongoose.models.FoodSeeker) {
      modelDetails.foodSeekerSchema = Object.keys(mongoose.models.FoodSeeker.schema.paths);
    }
    if (mongoose.models.Volunteer) {
      modelDetails.volunteerSchema = Object.keys(mongoose.models.Volunteer.schema.paths);
    }
    
    // Return all test information
    res.json({
      success: true,
      message: 'Auth system configuration check',
      environment: envCheck,
      userModels,
      modelDetails,
      dbConnection: {
        readyState: mongoose.connection.readyState,
        stateDescription: getReadyStateDescription(mongoose.connection.readyState)
      }
    });
  } catch (error) {
    console.error('Auth test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Helper function to convert readyState to description
function getReadyStateDescription(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    4: 'unauthorized'
  };
  return states[state] || 'unknown';
}

module.exports = router; 