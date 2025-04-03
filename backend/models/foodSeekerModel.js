const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const foodSeekerSchema = mongoose.Schema(
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

    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    foodRequirements: {
      type: String,
      required: [true, 'Please specify your food requirements'],
    },
    familySize: {
      type: Number,
      required: [true, 'Please add family size'],
    },
    userType: {
      type: String,
      default: 'foodSeeker',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
foodSeekerSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    console.log('Hashing password for food seeker user');
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
foodSeekerSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

const FoodSeeker = mongoose.model('FoodSeeker', foodSeekerSchema);

module.exports = FoodSeeker; 