const CacheError = require("../models/CacheError");

const formatError = (message, details) => {
  return new CacheError(message, details);
};

module.exports = formatError;
