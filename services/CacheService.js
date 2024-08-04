const Errors = require("../config/ErrorConfig");

const formatError = require("../utils/formatError");

class CacheService {
  constructor(cache) {
    this.cache = cache;
  }

  async readAll() {
    return this.cache.readAll();
  }

  async read(id) {
    return this.cache.read(parseInt(id));
  }

  async write(data, type, size) {
    return this.cache.write(data, type, size);
  }

  async update(url, fetchData) {
    return this.cache.update(async () => fetchData(url));
  }

  async deleteAll() {
    return this.cache.deleteAll();
  }

  async delete(id) {
    return this.cache.delete(parseInt(id));
  }

  async updateItem(id, data, type, size) {
    return this.cache.updateItem(parseInt(id), data, type, size);
  }

  async updateCapacity(capacity) {
    const oldCapacity = this.cache.capacity;
    this.cache.capacity = capacity;

    if (this.cache.isFull()) {
      this.cache.capacity = oldCapacity;
      throw formatError("Невозможно изменить емкость кеша", Errors.CACHE_FULL);
    }

    return this.cache;
  }
}

module.exports = CacheService;
