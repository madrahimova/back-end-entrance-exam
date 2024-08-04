const Errors = require("../config/ErrorConfig");
const Items = require("./Items");

const formatError = require("../utils/formatError");

class Cache {
  #items;

  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.#items = new Items();
  }

  async update(updater) {
    return updater()
      .then(([data, type, size]) => this.write(data, type, size))
      .catch((e) => {
        throw e;
      });
  }

  async write(data, type, size) {
    this.#grow(size);

    return this.#items.write(data, type, size).catch((e) => {
      this.#reduce(size);
      throw e;
    });
  }

  #grow(size) {
    const message = "Невозможно увеличить кеш";
    this.size += size;

    if (this.isFull()) {
      this.#reduce(size);
      throw formatError(message, Errors.CACHE_FULL);
    }
  }

  #reduce(size) {
    this.size -= size;

    if (this.isEmpty()) {
      this.size = 0;
    }
  }

  async readAll() {
    return this.#items.readAll();
  }

  async read(id) {
    return this.#items.read(id);
  }

  deleteAll() {
    this.#reduce(this.size);

    return this.#items.deleteAll();
  }

  delete(id) {
    return this.read(id)
      .then((item) => {
        this.#reduce(item.size);

        return this.#items.delete(id);
      })
      .catch((e) => {
        throw e;
      });
  }

  updateItem(id, data, type, size) {
    return this.read(id)
      .then((item) => {
        if (item.size < size) {
          this.#grow(size - item.size);
        } else {
          this.#reduce(item.size - size);
        }

        return this.#items.update(id, data, type, size);
      })
      .catch((e) => {
        throw e;
      });
  }

  isEmpty() {
    return this.size <= 0;
  }

  isFull() {
    return this.size >= this.capacity;
  }
}

module.exports = Cache;
