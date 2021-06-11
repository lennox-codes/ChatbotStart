const Order = require("./Order");

module.exports = class OrderItem {
  constructor() {
    this.state = "";
    this.size = "";
    this.toppings = "";
    this.drinks = "";
    this.name = "";
    this.description = "";
  }
};
