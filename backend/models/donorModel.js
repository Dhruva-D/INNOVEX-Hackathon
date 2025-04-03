const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Food Donation Schema
const foodDonationSchema = new mongoose.Schema(
  {
    foodImageUrl: {
      type: String,
      required: false,
    },
    foodType: {
      type: String,
      required: true,
      enum: [
        'Vegetables', 
        'Fruits', 
        'Cooked Meals', 
        'Bakery Items', 
        'Canned Goods', 
        'Dairy Products',
        'Grains & Cereals',
        'Beverages',
        'Other'
      ]
    },
    quantity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Reserved', 'Collected', 'Expired'],
      default: 'Available',
    },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodSeeker',
      required: false,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const donorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    userType: {
      type: String,
      default: 'donor',
    },
    // Add donations array to track all donations by this donor
    donations: [foodDonationSchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
donorSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    console.log('Hashing password for donor user');
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Method to check if entered password matches the hashed password
donorSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

// Virtual for active donations count
donorSchema.virtual('activeDonationsCount').get(function() {
  return this.donations.filter(donation => 
    donation.status === 'Available' && new Date(donation.expiryDate) > new Date()
  ).length;
});

// Virtual for completed donations count
donorSchema.virtual('completedDonationsCount').get(function() {
  return this.donations.filter(donation => 
    donation.status === 'Collected'
  ).length;
});

// Set virtuals to be included in JSON
donorSchema.set('toJSON', { virtuals: true });
donorSchema.set('toObject', { virtuals: true });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor; 