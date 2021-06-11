module.exports = class Menu {
  static items = ["shawarma", "pizza", "steak"];

  static addItem(item) {
    this.menuItem.push(item);
  }

  static hasItem(item) {
    return this.items.includes(item.toLowerCase());
  }

  static listItems() {
    let itemsList = [];
    this.items.forEach((item, index) => {
      itemsList.push(`${index + 1}) ${item}`);
    });

    return itemsList.join("\n");
  }
};
