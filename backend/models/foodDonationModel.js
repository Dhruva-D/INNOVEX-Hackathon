const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, 'Please provide the name of the food'],
    trim: true
  },
  quantityInPlates: {
    type: Number,
    required: [true, 'Please specify the number of plates'],
    min: [1, 'Quantity must be at least 1 plate']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A donation must be associated with a donor']
  },
  location: {
    type: String,
    required: [true, 'Please provide the pickup location']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please specify when the food will expire']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image of the food']
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Create indexes for common queries
foodDonationSchema.index({ donorId: 1, status: 1 });
foodDonationSchema.index({ status: 1, expiryDate: 1 });
foodDonationSchema.index({ location: '2dsphere' }); // For future geospatial queries

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

module.exports = FoodDonation; 