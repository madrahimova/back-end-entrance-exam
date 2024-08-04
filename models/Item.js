class Item {
  data = {};
  type = "";
  size = 0;

  constructor(id, data, type, size) {
    this.id = id;
    this.data = data || this.data;
    this.type = type || this.type;
    this.size = size || this.size;
  }
}

module.exports = Item;
