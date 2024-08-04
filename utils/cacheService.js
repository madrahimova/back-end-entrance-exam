const Cache = require("../models/Cache");
const CacheConfig = require("../config/CacheConfig");
const CacheService = require("../services/CacheService");

const cacheService = (size) => {
  return new CacheService(new Cache(size));
};

module.exports = cacheService(CacheConfig.DEFAULT_SIZE);
