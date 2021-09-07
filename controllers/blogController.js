const Blog = require('./../models/blogModel');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./../controllers/handlerFactory');

exports.approveBlog = (req, res, next) => {
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
