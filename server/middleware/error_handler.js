function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message || "server error",
    success: false,
    data: null,
  });
}

module.exports = errorHandler;
