const Blog = require('./../models/blogModel');
const AppError = require('./../utils/appError');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./../controllers/handlerFactory');

exports.approveBlog = (req, res, next) => {
  if (!req.user.role === 'admin' || !req.user.isApproved) {
    return next(
      new AppError(
        'You are not approved as admin yet. Only Approved admin can approve Blogs'
      )
    );
  }
  req.body = { isApproved: true };
  next();
};

exports.getAllBlogs = getAll(Blog, {
  path: 'writer',
  select: 'name role isApproved',
});
exports.getBlog = getOne(Blog, {
  path: 'writer',
  select: 'name role isApproved',
});
exports.createBlog = createOne(Blog);
exports.updateBlog = updateOne(Blog);
exports.deleteBlog = deleteOne(Blog);
