const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  approveAdmin,
} = require('../controllers/userController');

// const User = require('./../models/userModel');

const {
  signup,
  login,
  protect,
  restrictTo,
  authorizeUser,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router
  .route('/approve-admins/:id')
  .patch(protect, restrictTo('super-admin'), approveAdmin, updateUser);

router.route('/me').get(protect, getMe, getUser);
router.route('/updateMe').patch(protect, updateMe);
router.route('/deleteMe').delete(protect, deleteMe);

router.route('/').get(protect, restrictTo('super-admin', 'admin'), getAllUsers);
router
  .route('/:id')
  .get(protect, getUser)
  .patch(protect, authorizeUser, updateUser)
  .delete(protect, authorizeUser, deleteUser);

module.exports = router;
