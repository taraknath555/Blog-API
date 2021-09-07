const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Blog must have a name'],
    trim: true,
    minLength: [10, 'A blog name must have equal or more then 10 characters'],
    maxLength: [20, 'A blog name must have equal or less than 20 characters'],
  },
  content: {
    type: String,
    required: [true, 'A Blog must have some content'],
    trim: true,
    minLength: [
      50,
      'A blog content must have equal or more then 50 characters',
    ],
    maxLength: [500, 'A blog name must have equal or less than 500 characters'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be equal or above 1.0'],
    max: [5, 'Ratings must be equal or below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  creatingDate: {
    type: Date,
    default: Date.now(),
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  writer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
