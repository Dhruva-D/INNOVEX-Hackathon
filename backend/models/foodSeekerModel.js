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
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password
foodSeekerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const FoodSeeker = mongoose.model('FoodSeeker', foodSeekerSchema);

module.exports = FoodSeeker; 