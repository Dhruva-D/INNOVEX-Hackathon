const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Donor = require('../models/donorModel');
const FoodSeeker = require('../models/foodSeekerModel');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

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

// @desc    Create a new food donation
// @route   POST /api/donations
// @access  Private (donor only)
router.post('/', protect, upload.single('foodImage'), async (req, res) => {
  try {
    // Verify user is a donor
    if (req.userType !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create donations' });
    }

    const donor = await Donor.findById(req.user._id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Create donation object
    const newDonation = {
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      location: req.body.location,
      expiryDate: new Date(req.body.expiryDate),
      originalPrice: req.body.originalPrice,
    };

    // Add image URL if an image was uploaded
    if (req.file) {
      // In a production system, you'd likely use cloud storage like AWS S3
      // For demo, we're using local storage
      newDonation.foodImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Add coordinates if provided
    if (req.body.latitude && req.body.longitude) {
      newDonation.coordinates = {
        lat: parseFloat(req.body.latitude),
        lng: parseFloat(req.body.longitude),
      };
    }

    // Add donation to donor's donations array
    donor.donations.push(newDonation);
    await donor.save();

    // Return the newly created donation
    res.status(201).json({
      message: 'Donation created successfully',
      donation: donor.donations[donor.donations.length - 1],
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      message: 'Error creating donation',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all donors with available donations
    const donors = await Donor.find({
      'donations.status': 'Available',
      'donations.expiryDate': { $gt: new Date() },
    }).select('-password');

    // Extract available donations
    let availableDonations = [];
    donors.forEach(donor => {
      const donorDonations = donor.donations
        .filter(d => d.status === 'Available' && new Date(d.expiryDate) > new Date())
        .map(d => ({
          ...d.toObject(),
          donorId: donor._id,
          donorName: donor.name,
        }));
      availableDonations = [...availableDonations, ...donorDonations];
    });

    res.json(availableDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      message: 'Error fetching donations',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get donations by donor
// @route   GET /api/donations/my-donations
// @access  Private (donor only)
router.get('/my-donations', protect, async (req, res) => {
  try {
    if (req.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donor = await Donor.findById(req.user._id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({
      donations: donor.donations,
      activeDonationsCount: donor.activeDonationsCount,
      completedDonationsCount: donor.completedDonationsCount,
      totalDonationsCount: donor.donations.length,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      message: 'Error fetching donations',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Update donation status
// @route   PATCH /api/donations/:donationId
// @access  Private
router.patch('/:donationId', protect, async (req, res) => {
  try {
    const donor = await Donor.findOne({
      'donations._id': req.params.donationId,
    });

    if (!donor) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Find the donation in the donor's donations array
    const donationIndex = donor.donations.findIndex(
      (d) => d._id.toString() === req.params.donationId
    );

    if (donationIndex === -1) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user is authorized to update (donor, assigned seeker, or volunteer)
    const donation = donor.donations[donationIndex];
    const userId = req.user._id.toString();
    const isDonor = donor._id.toString() === userId;
    const isAssignedSeeker = donation.seeker && donation.seeker.toString() === userId;
    const isAssignedVolunteer = donation.volunteer && donation.volunteer.toString() === userId;

    if (!isDonor && !isAssignedSeeker && !isAssignedVolunteer && req.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this donation' });
    }

    // Update donation fields
    if (req.body.status) {
      donation.status = req.body.status;
    }

    // If food seeker is claiming the donation
    if (req.userType === 'foodSeeker' && req.body.status === 'Reserved') {
      donation.seeker = req.user._id;
    }

    // If volunteer is accepting to deliver
    if (req.userType === 'volunteer' && req.body.status === 'Reserved') {
      donation.volunteer = req.user._id;
    }

    await donor.save();

    res.json({
      message: 'Donation updated successfully',
      donation: donor.donations[donationIndex],
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({
      message: 'Error updating donation',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get counts for dashboard
    const donors = await Donor.find();
    
    let totalDonations = 0;
    let activeDonations = 0;
    let completedDonations = 0;
    let foodTypes = {};
    let totalQuantity = 0;
    
    // Calculate statistics
    donors.forEach(donor => {
      totalDonations += donor.donations.length;
      
      donor.donations.forEach(donation => {
        if (donation.status === 'Available' && new Date(donation.expiryDate) > new Date()) {
          activeDonations++;
        }
        
        if (donation.status === 'Collected') {
          completedDonations++;
        }
        
        // Count food types
        if (foodTypes[donation.foodType]) {
          foodTypes[donation.foodType]++;
        } else {
          foodTypes[donation.foodType] = 1;
        }
        
        // Estimate total quantity - this is rough since quantities are stored as strings with units
        const quantityMatch = donation.quantity.match(/^(\d+(\.\d+)?)/);
        if (quantityMatch && quantityMatch[1]) {
          totalQuantity += parseFloat(quantityMatch[1]);
        }
      });
    });
    
    // Convert foodTypes to array for chart display
    const foodTypeDistribution = Object.keys(foodTypes).map(key => ({
      name: key,
      value: foodTypes[key]
    }));
    
    res.json({
      totalDonations,
      activeDonations,
      completedDonations,
      activeDonors: donors.filter(d => d.activeDonationsCount > 0).length,
      foodTypeDistribution,
      totalQuantity: Math.round(totalQuantity * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({
      message: 'Error fetching donation stats',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
});

module.exports = router; 