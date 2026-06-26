const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  }
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
