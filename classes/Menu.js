module.exports = class Menu {
  static items = ["shawarma", "pizza", "steak"];

  static addItem(item) {
    this.menuItem.push(item);
  }

  static hasItem(item) {
    return this.items.includes(item.toLowerCase());
  }

  static listItems() {
    let itemsList = "";
    for (let item of this.items) {
      itemsList += ` \n${this.items.indexOf(item) + 1}. ${item}`;
    }
    return itemsList;
  }
};
