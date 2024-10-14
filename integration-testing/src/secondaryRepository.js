class SecondaryRepository {
    constructor() {
      this.data = [
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
      ];
    }
  
    getItemById(id) {
      return this.data.find(item => item.id === id);
    }

    deleteItem(id) {
      const index = this.data.findIndex(item => item.id === id);
      if (index !== -1) {
          const [deletedItem] = this.data.splice(index, 1);
          return deletedItem;
      }
      return null;
  }
  }
  
  module.exports = SecondaryRepository;