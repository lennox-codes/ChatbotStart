const Order = require("../baseClasses/Order");
const OrderItem = require("../baseClasses/OrderItem");

const OrderState = Object.freeze({
  START: Symbol(),
  READINESS: Symbol(),
  SIDES: Symbol(),
  DESSERT: Symbol(),
  COMPLETE: Symbol(),
  ADD_ITEM: Symbol(),
});

class SteakOrder extends OrderItem {
  constructor() {
    super();
    this.state = OrderState.START;
    this.name = "steak";
    this.sides = "";
    this.dessert = "";
    this.readiness = "";
    this.basePrice = 12;
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
        this.readiness = input;
        messages.push("What sides would you like?");
        messages.push("Your options are fries or salad.");
        break;
      case OrderState.SIDES:
        this.state = OrderState.DESSERT;
        this.sides = input;
        messages.push("Would you like desserts with that?");
        messages.push("If yes, please specify");
        messages.push(
          "Your options are strawberry shortcake, butter biscuits and pumpkin puddings"
        );
        break;
      case OrderState.DESSERT:
        this.state = OrderState.COMPLETE;
        if (input.toLowerCase() !== "no") this.dessert = input;

      case OrderState.COMPLETE:
        this.state = OrderState.ADD_ITEM;
        this.getTotal();
        this.description = `${this.readiness}-cooked ${this.name} with ${
          this.sides
        } ${this.dessert ? "and " + this.dessert : ""}`;
        messages.push("Added " + this.description);
        messages.push(`Would you like to order another item?`);
        messages.push(`Yes or No?`);
        break;
      case OrderState.ADD_ITEM:
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

  getTotal() {
    let total = this.basePrice;
    const DESSERT_PRICE = 2;
    if (this.dessert) total += DESSERT_PRICE;
    return (this.finalPrice = total);
  }
}

module.exports = SteakOrder;
