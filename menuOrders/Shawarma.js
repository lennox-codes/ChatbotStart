const Order = require("../classes/Order");
const OrderItem = require("../classes/OrderItem");

const OrderState = Object.freeze({
  START: Symbol(),
  SELECT_ITEM: Symbol(),
  SIZE: Symbol(),
  TOPPINGS: Symbol(),
  DRINKS: Symbol(),
  COMPLETE: Symbol(),
  ADD_ITEM: Symbol(),
});

class ShawarmaOrder extends OrderItem {
  constructor() {
    super();
    this.name = "shawarma";
    this.size = "";
    this.toppings = "";
    this.drinks = "";
    this.state = OrderState.START;
    this.basePrice = 12;
  }

  handleInput(input) {
    let messages = [];
    switch (this.state) {
      case OrderState.START:
        messages.push("What size would you like with that?");
        messages.push("Your options are small, medium and large?");
        this.state = OrderState.SIZE;
        break;

      case OrderState.SIZE:
        this.state = OrderState.TOPPINGS;
        this.size = input;
        messages.push("What toppings would you like?");
        break;

      case OrderState.TOPPINGS:
        this.state = OrderState.DRINKS;
        this.toppings = input;
        messages.push("Would you like drinks with that?");
        messages.push("Your options are fanta, coke and sprite");
        break;

      case OrderState.DRINKS:
        this.state = OrderState.COMPLETE;
        if (input.toLowerCase() !== "no") this.drinks = input;

      case OrderState.COMPLETE:
        this.state = OrderState.ADD_ITEM;
        this.getTotal();
        this.description = `${this.size} ${this.name} with ${this.toppings} ${
          this.drinks ? "and a bottle of " + this.drinks : ""
        }`;
        messages.push("Added " + this.description);
        messages.push(`Would you like to order another item?`);
        messages.push(`Yes or No?`);
        break;

      case OrderState.ADD_ITEM:
        console.log(Order);
        if (input.toLowerCase() === "yes") Order.state = "welcoming";
        else Order.state = "finished";

        messages.push("Reply with OK to Confirm");
        break;
    }
    return messages;
  }

  getTotal() {
    let total = this.basePrice;
    const LARGE_PRICE = 3;
    const SMALL_PRICE = -2;

    if (this.size.toLowerCase() == "large") total += LARGE_PRICE;
    else if (this.size.toLowerCase() == "small") total + SMALL_PRICE;

    this.finalPrice = total;
    return this.finalPrice;
  }
}

module.exports = ShawarmaOrder;
