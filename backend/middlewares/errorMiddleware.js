// Catch requests with non-existent routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error handler
const errorHandler = (err, req, res, next) => {
  // Sometimes Express might not set a status code if the error was caught elsewhere
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('Error caught by middleware:', {
    message: err.message,
    path: req.path,
    method: req.method,
    statusCode,
    stack: process.env.NODE_ENV === 'production' ? 'hidden in production' : err.stack,
  });
  
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler, notFound }; 