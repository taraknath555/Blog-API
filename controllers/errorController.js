const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400, err);
};

handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400, err);
};

const handleDublicateFieldDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Dublicate field value ${value}. Please use another value`;
  return new AppError(message, 400, err);
};

handleJWTError = (err) =>
  new AppError('Invalid token, Please login again', 401, err);

handleJWTExpire = (err) =>
  new AppError('Token expired, please login again', 401, err);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDublicateFieldDB(err);
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
  if (err.name === 'TokenExpiredError') err = handleJWTExpire(err);

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else sendErrorProd(err, res);
};
