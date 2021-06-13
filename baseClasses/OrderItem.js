const Order = require("./Order");

module.exports = class OrderItem {
  constructor() {
    this.state = "";
    this.name = "medium";
    this.description = "";
    this.basePrice = 0;
    this.finalPrice = 0;
  }

  getTotal() {
    let total = this.basePrice;
    this.finalPrice = total;
    return this.finalPrice;
  }
};
