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
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password
volunteerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer; 