const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const volunteerSchema = mongoose.Schema(
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
    availability: {
      type: String,
      required: [true, 'Please add your availability'],
    },
    skills: {
      type: [String],
      default: [],
    },
    userType: {
      type: String,
      default: 'volunteer',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
volunteerSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    console.log('Hashing password for volunteer user');
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
volunteerSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer; 