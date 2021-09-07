const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'writer'],
    default: 'writer',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minLength: [8, 'Password must be greater than 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords must be equal',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

//Pre Save Hook --> Hashing the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  if (this.role === 'writer') this.isApproved = true;

  next();
});

//Checking password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

//Filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
