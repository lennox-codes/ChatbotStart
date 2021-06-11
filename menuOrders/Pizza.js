const Order = require("../classes/Order");
//const OrderItem = require("../classes/OrderItem");
const ShawarmaOrder = require("./Shawarma");

//This is this way since the Shawarma and Pizza Orders are almost the same
class PizzaOrder extends ShawarmaOrder {
  constructor() {
    super();
    this.name = "pizza";
    this.basePrice = 10;
  }
}

module.exports = PizzaOrder;
