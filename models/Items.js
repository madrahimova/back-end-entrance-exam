const crypto = require("crypto");

const Errors = require("../config/ErrorConfig");
const Item = require("./Item");

const formatError = require("../utils/formatError");

class Items {
  #idMap = {};
  #items = {};
  #currentId = 0;

  async write(data, type, size) {
    const message = "Невозможно создать элемент";
    const hash = this.#hash(data);

    if (Object.hasOwn(this.#items, hash)) {
      throw formatError(message, Errors.ITEM_EXISTS);
    }

    const item = new Item(this.#nextId(), data, type, size);
    this.#idMap[item.id] = hash;
    this.#items[hash] = item;

    return item;
  }

  async readAll() {
    return Object.values(this.#items);
  }

  async read(id) {
    const message = "Невозможно получить элемент";

    if (typeof id !== "number" || id < 1) {
      throw formatError(message, Errors.INVALID_ID);
    }

    if (!Object.hasOwn(this.#idMap, id)) {
      throw formatError(message, Errors.ITEM_NOT_FOUND);
    }

    return this.#items[this.#idMap[id]];
  }

  deleteAll() {
    this.#items = {};
    this.#idMap = {};

    return true;
  }

  delete(id) {
    const message = "Невозможно удалить элемент";

    if (typeof id !== "number" || id < 1) {
      return formatError(message, Errors.INVALID_ID);
    }

    if (!Object.hasOwn(this.#idMap, id)) {
      throw formatError(message, Errors.ITEM_NOT_FOUND);
    }

    delete this.#items[this.#idMap[id]];
    delete this.#idMap[id];

    return true;
  }

  update(id, data, type, size) {
    const hash = this.#hash(data);
    const item = new Item(id, data, type, size);

    this.#idMap[id] = hash;
    this.#items[hash] = item;

    return item;
  }

  #nextId() {
    this.#currentId++;
    return this.#currentId;
  }

  #hash(data) {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
  }
}

module.exports = Items;
