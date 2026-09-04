const AppError = require('../utils/AppError');

// Central error handler — must be registered last, after all routes.
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
