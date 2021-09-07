const express = require('express');
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  approveBlog,
} = require('./../controllers/blogController');

const { setUser } = require('./../controllers/userController');
const {
  protect,
  restrictTo,
  authorizeToBlogs,
} = require('./../controllers/authController');
const router = express.Router();

router
  .route('/approve-blogs/:id')
  .patch(protect, restrictTo('super-admin', 'admin'), approveBlog, updateBlog);

router
  .route('/')
  .get(getAllBlogs)
  .post(protect, restrictTo('writer'), setUser, createBlog);

router
  .route('/:id')
  .get(getBlog)
  .patch(protect, authorizeToBlogs, updateBlog)
  .delete(protect, authorizeToBlogs, deleteBlog);

module.exports = router;
