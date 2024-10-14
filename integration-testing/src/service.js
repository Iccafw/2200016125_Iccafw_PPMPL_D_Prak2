const Repository = require('./repository');

class Service {
  constructor() {
    this.repository = new Repository();
  }

  getAllItems() {
    return this.repository.getAllItems();
  }

  getItemById(id) {
    let item = this.primaryRepository.getItemById(id);
    if (!item) {
      item = this.secondaryRepository.getItemById(id);
    }
    if (!item) {
      throw new Error('Item not found in both repositories');
    }
    return item;
  }

  addItem(name) {
    const newItem = { id: this.repository.data.length + 1, name };
    this.repository.addItem(newItem);
    return newItem;
  }

  deleteItem(id) {
    let item = this.primaryRepository.deleteItem(id);
    if (item) {
        return item;
    }

    item = this.secondaryRepository.deleteItem(id);
    if (item) {
        return item;
    }

    throw new Error('Item not found in both repositories');
}
}

module.exports = Service;