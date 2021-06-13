const Order = require("../classes/Order");
const ShawarmaOrder = require("./Shawarma");

class PizzaOrder extends ShawarmaOrder {
  constructor() {
    super();
    this.name = "pizza";
    this.basePrice = 10;
  }
}

module.exports = PizzaOrder;
