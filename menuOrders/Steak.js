const Order = require("../classes/Order");
const OrderItem = require("../classes/OrderItem");

const OrderState = Object.freeze({
  START: Symbol(),
  READINESS: Symbol(),
  SIDES: Symbol(),
  DRINKS: Symbol(),
  COMPLETE: Symbol(),
  ADD_ITEM: Symbol(),
});

class ShawarmaOrder extends OrderItem {
  constructor() {
    super();
    this.sides = "";
    this.state = OrderState.START;
    this.name = "steak";
  }

  handleInput(input) {
    let messages = [];
    switch (this.state) {
      case OrderState.START:
        messages.push("What readiness level would you like?");
        this.state = OrderState.READINESS;
        break;
      case OrderState.READINESS:
        this.state = OrderState.SIDES;
        this.size = input;
        messages.push("What sides would you like?");
        break;
      case OrderState.SIDES:
        this.state = OrderState.DRINKS;
        this.sides = input;
        messages.push("Would you like drinks with that?");
        messages.push("If yes, specify:");
        messages.push("Your options are fanta, coke and sprite");
        break;
      case OrderState.DRINKS:
        this.state = OrderState.COMPLETE;
        if (input.toLowerCase() !== "no") {
          this.drinks = input;
        } else messages.push;
      case OrderState.COMPLETE:
        this.state = OrderState.ADD_ITEM;
        this.description = `${this.size} ${this.name} with ${this.sides} ${
          this.drinks ? "and a bottle of " + this.drinks : ""
        }`;
        messages.push("Added " + this.description);
        messages.push(`Would you like to order another item?`);
        messages.push(`Yes or No?`);
        break;
      case OrderState.ADD_ITEM:
        console.log(Order);
        if (input.toLowerCase() === "yes") {
          Order.state = "welcoming";
          messages.push("Write OK to Confirm");
        } else {
          Order.state = "finished";
          messages.push("Write OK to Confirm");
        }
        break;
    }
    return messages;
  }
}

module.exports = ShawarmaOrder;
