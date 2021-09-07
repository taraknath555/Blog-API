const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./../models/userModel');
const Blog = require('./../models/blogModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = async (id) => {
  return await promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, res, statusCode) => {
  const token = await signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  };
  res.cookie('jwt', token, cookieOptions);

  //only set to undefined not save so not visible to output only
  //still persist in Database
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  await createSendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  //Checking credentials
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  await createSendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //checking token exist or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in, Please login first', 401));
  }

  //varification of token
  //decoded - { id: '5c8a20d32f8fb814b56fa187', iat: 1630209770, exp: 1637985770 }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exist: Not deleted after logging in
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User belonging to this token no longer exist', 401)
    );
  }
  //We can also check here if password change in recent time after login or not

  //If all good add cuurentUser to req object
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.authorizeToBlogs = catchAsync(async (req, res, next) => {
  if (req.user.role === 'super-admin' || req.user.role === 'admin')
    return next();
  const blog = await Blog.findById(req.params.id);
  if (!blog.writer.equals(req.user._id)) {
    return next(
      new AppError(
        'You do not have permission to update or delete this blog',
        403
      )
    );
  }
  next();
});

//To restrict one user access data of other user
exports.authorizeUser = (req, res, next) => {
  if (req.user.role === 'super-admin' || req.user.role === 'admin')
    return next();
  if (!mongoose.Types.ObjectId(req.params.id).equals(req.user._id)) {
    return next(
      new AppError('You are not authorize to perfor this action', 403)
    );
  }
  next();
};
