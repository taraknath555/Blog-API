class AppError extends Error {
  constructor(message, statusCode, err = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.err = err;
    this.stack = err.stack;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
