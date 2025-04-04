const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FoodDonation = require('../models/foodDonationModel');

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// @desc    Test donation submission (no auth required)
// @route   POST /api/test/donation
// @access  Public
router.post('/donation', upload.single('foodImage'), async (req, res) => {
  try {
    console.log('Test donation received:', req.body);
    
    // Create a new food donation
    const newDonation = new FoodDonation({
      foodName: req.body.foodName,
      quantityInPlates: req.body.quantityInPlates,
      location: req.body.location,
      expiryDate: new Date(req.body.expiryDate),
      donorId: new mongoose.Types.ObjectId(), // Mock donor ID for testing
      status: 'available',
    });

    // Add image URL if an image was uploaded
    if (req.file) {
      // For demo, using local storage
      newDonation.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else {
      // Use a placeholder image if no image is provided
      newDonation.imageUrl = `${req.protocol}://${req.get('host')}/uploads/placeholder.jpg`;
    }

    // Save the donation to the database
    await newDonation.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Test donation created successfully',
      _id: newDonation._id,
      foodName: newDonation.foodName,
      quantityInPlates: newDonation.quantityInPlates,
      location: newDonation.location,
      expiryDate: newDonation.expiryDate,
      status: newDonation.status,
      imageUrl: newDonation.imageUrl,
      timestamp: newDonation.createdAt || new Date()
    });
  } catch (error) {
    console.error('Test donation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// @desc    Get test donations
// @route   GET /api/test/donations
// @access  Public
router.get('/donations', async (req, res) => {
  try {
    const donations = await FoodDonation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching test donations:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

module.exports = router; 