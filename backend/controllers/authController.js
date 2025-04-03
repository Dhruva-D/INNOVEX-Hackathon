const Donor = require('../models/donorModel');
const FoodSeeker = require('../models/foodSeekerModel');
const Volunteer = require('../models/volunteerModel');
const { generateToken, verifyToken } = require('../utils/jwtUtils');

// Protect middleware to verify JWT token
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user based on userType
    let user;
    if (decoded.userType === 'donor') {
      user = await Donor.findById(decoded.id).select('-password');
    } else if (decoded.userType === 'foodSeeker') {
      user = await FoodSeeker.findById(decoded.id).select('-password');
    } else if (decoded.userType === 'volunteer') {
      user = await Volunteer.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user and userType to request object
    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { userType, name, email, password, phone, location, ...additionalData } = req.body;

  try {
    console.log('Signup request received:', { userType, email });
    
    // Validate required fields
    if (!userType || !name || !email || !password || !phone || !location) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: {
          userType: !userType,
          name: !name,
          email: !email,
          password: !password,
          phone: !phone,
          location: !location
        }
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists based on userType
    let userExists;
    if (userType === 'donor') {
      userExists = await Donor.findOne({ email });
    } else if (userType === 'foodSeeker') {
      userExists = await FoodSeeker.findOne({ email });
    } else if (userType === 'volunteer') {
      userExists = await Volunteer.findOne({ email });
    } else {
      console.log('Invalid user type:', userType);
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user based on userType
    let user;
    try {
      if (userType === 'donor') {
        user = await Donor.create({
          name,
          email,
          password,
          phone,
          location,
        });
        console.log('Donor created with id:', user._id);
      } else if (userType === 'foodSeeker') {
        const { foodRequirements, familySize } = additionalData;
        if (!foodRequirements || !familySize) {
          return res.status(400).json({ 
            message: 'Food requirements and family size are required for food seekers',
            missingFields: {
              foodRequirements: !foodRequirements,
              familySize: !familySize
            }
          });
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
        console.log('Food Seeker created with id:', user._id);
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
        console.log('Volunteer created with id:', user._id);
      }

      // Verify user was created
      if (!user) {
        throw new Error('Failed to create user');
      }

      // Verify user exists in database
      let verifiedUser;
      if (userType === 'donor') {
        verifiedUser = await Donor.findById(user._id);
      } else if (userType === 'foodSeeker') {
        verifiedUser = await FoodSeeker.findById(user._id);
      } else if (userType === 'volunteer') {
        verifiedUser = await Volunteer.findById(user._id);
      }

      if (!verifiedUser) {
        throw new Error('User not found in database after creation');
      }

      const token = generateToken(verifiedUser._id, userType);
      console.log('User created successfully, token generated');
      
      res.status(201).json({
        _id: verifiedUser._id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        phone: verifiedUser.phone,
        location: verifiedUser.location,
        userType,
        token,
      });
    } catch (createError) {
      console.error('Error creating user:', createError);
      return res.status(400).json({ 
        message: 'Error creating user', 
        error: createError.message,
        stack: process.env.NODE_ENV === 'production' ? null : createError.stack
      });
    }
  } catch (error) {
    console.error('Server error during signup:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    console.log('Login request received:', { email, userType });
    
    // Validate required fields
    if (!email || !password || !userType) {
      console.log('Missing required fields for login');
      return res.status(400).json({ 
        message: 'Email, password, and user type are required',
        missingFields: {
          email: !email,
          password: !password,
          userType: !userType
        }
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user based on userType
    let user;
    if (userType === 'donor') {
      user = await Donor.findOne({ email });
    } else if (userType === 'foodSeeker') {
      user = await FoodSeeker.findOne({ email });
    } else if (userType === 'volunteer') {
      user = await Volunteer.findOne({ email });
    } else {
      console.log('Invalid user type for login:', userType);
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token and return user data
    const token = generateToken(user._id, userType);
    console.log('Login successful, token generated');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      userType,
      token,
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    console.log('Profile request for user:', req.user?._id);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user still exists in database
    let user;
    if (req.userType === 'donor') {
      user = await Donor.findById(req.user._id);
    } else if (req.userType === 'foodSeeker') {
      user = await FoodSeeker.findById(req.user._id);
    } else if (req.userType === 'volunteer') {
      user = await Volunteer.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      userType: req.userType,
      ...user._doc,
    });
  } catch (error) {
    console.error('Server error retrieving profile:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  protect
}; 