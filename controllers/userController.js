const User = require('./../models/userModel');
const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  console.log(req.user);
  req.params.id = req.user._id;
  next();
};

exports.setUser = (req, res, next) => {
  if (!req.body.writer) req.body.writer = req.user._id;
  next();
};

exports.approveAdmin = (req, res, next) => {
  req.body = { isApproved: true };
  next();
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
