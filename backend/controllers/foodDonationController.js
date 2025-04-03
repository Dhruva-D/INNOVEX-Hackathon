const FoodDonation = require('../models/foodDonationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create a new food donation
exports.createFoodDonation = catchAsync(async (req, res, next) => {
  // Add the donor's ID to the donation data
  const donationData = {
    ...req.body,
    donorId: req.user._id
  };

  const donation = await FoodDonation.create(donationData);

  res.status(201).json({
    status: 'success',
    data: {
      donation
    }
  });
});

// Get all donations by the current donor
exports.getMyDonations = catchAsync(async (req, res, next) => {
  const donations = await FoodDonation.find({ donorId: req.user._id })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: donations.length,
    data: {
      donations
    }
  });
});

// Get all available donations (for NGOs/volunteers)
exports.getAvailableDonations = catchAsync(async (req, res, next) => {
  const donations = await FoodDonation.find({ 
    status: 'available',
    expiryDate: { $gt: new Date() }
  })
    .populate('donorId', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: donations.length,
    data: {
      donations
    }
  });
});

// Update donation status
exports.updateDonationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const donation = await FoodDonation.findById(id);

  if (!donation) {
    return next(new AppError('No donation found with that ID', 404));
  }

  // Only allow donor to update their own donations
  if (donation.donorId.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own donations', 403));
  }

  donation.status = status;
  await donation.save();

  res.status(200).json({
    status: 'success',
    data: {
      donation
    }
  });
});

// Delete a donation
exports.deleteDonation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const donation = await FoodDonation.findById(id);

  if (!donation) {
    return next(new AppError('No donation found with that ID', 404));
  }

  // Only allow donor to delete their own donations
  if (donation.donorId.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own donations', 403));
  }

  await donation.remove();

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 