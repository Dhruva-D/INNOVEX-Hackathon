const Donor = require('../models/donorModel');
const FoodSeeker = require('../models/foodSeekerModel');
const Volunteer = require('../models/volunteerModel');
const { generateToken } = require('../utils/jwtUtils');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { userType, name, email, password, phone, location, ...additionalData } = req.body;

  try {
    // Check if user exists based on userType
    let userExists;
    if (userType === 'donor') {
      userExists = await Donor.findOne({ email });
    } else if (userType === 'foodSeeker') {
      userExists = await FoodSeeker.findOne({ email });
    } else if (userType === 'volunteer') {
      userExists = await Volunteer.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user based on userType
    let user;
    if (userType === 'donor') {
      user = await Donor.create({
        name,
        email,
        password,
        phone,
        location,
      });
    } else if (userType === 'foodSeeker') {
      const { foodRequirements, familySize } = additionalData;
      if (!foodRequirements || !familySize) {
        return res.status(400).json({ message: 'Food requirements and family size are required for food seekers' });
      }
      user = await FoodSeeker.create({
        name,
        email,
        password,
        phone,
        location,
        foodRequirements,
        familySize,
      });
    } else if (userType === 'volunteer') {
      const { availability, skills } = additionalData;
      if (!availability) {
        return res.status(400).json({ message: 'Availability is required for volunteers' });
      }
      user = await Volunteer.create({
        name,
        email,
        password,
        phone,
        location,
        availability,
        skills: skills || [],
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        userType,
        token: generateToken(user._id, userType),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    // Find user based on userType
    let user;
    if (userType === 'donor') {
      user = await Donor.findOne({ email });
    } else if (userType === 'foodSeeker') {
      user = await FoodSeeker.findOne({ email });
    } else if (userType === 'volunteer') {
      user = await Volunteer.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        userType,
        token: generateToken(user._id, userType),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      location: req.user.location,
      userType: req.userType,
      ...req.user._doc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
}; 