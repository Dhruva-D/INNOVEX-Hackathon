const express = require('express');
const foodDonationController = require('../controllers/foodDonationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for donors
router.post('/', foodDonationController.createFoodDonation);
router.get('/my-donations', foodDonationController.getMyDonations);
router.patch('/:id/status', foodDonationController.updateDonationStatus);
router.delete('/:id', foodDonationController.deleteDonation);

// Routes for NGOs/volunteers
router.get('/available', foodDonationController.getAvailableDonations);

module.exports = router; 