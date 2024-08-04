class CacheError extends Error {
  constructor(message, details) {
    super(message);

    this.issue = message;
    this.details = details;
  }
}

module.exports = CacheError;
