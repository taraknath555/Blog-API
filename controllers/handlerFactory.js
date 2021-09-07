const AppError = require('../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAll = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let query = features.query;
    if (popOption) query = query.populate(popOption);

    const docs = await query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: newDoc },
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { doc: updatedDoc },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
