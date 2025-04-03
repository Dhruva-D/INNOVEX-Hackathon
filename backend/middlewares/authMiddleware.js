const jwt = require('jsonwebtoken');
const DonorModel = require('../models/donorModel');
const FoodSeekerModel = require('../models/foodSeekerModel');
const VolunteerModel = require('../models/volunteerModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token based on user type
      if (decoded.userType === 'donor') {
        req.user = await DonorModel.findById(decoded.id).select('-password');
      } else if (decoded.userType === 'foodSeeker') {
        req.user = await FoodSeekerModel.findById(decoded.id).select('-password');
      } else if (decoded.userType === 'volunteer') {
        req.user = await VolunteerModel.findById(decoded.id).select('-password');
      }

      req.userType = decoded.userType;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect }; 