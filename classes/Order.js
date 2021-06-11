class Order {
  constructor() {
    this.state = "welcoming";
    this.custId = "";
    this.items = [];
    this.states = ["welcoming", "selecting", "isFinished", "moreItems"];
    this.total = 0;

    if (Order._instance) {
      return Order._instance;
    }
    Order._instance = this;
  }

  reset() {
    this.state = "welcoming";
    this.items = [];
    this.custId = "";
    this.total = 0;
  }

  addItem(item) {
    this.items.push(item);
  }

  formatPrice(price) {
    return "$" + price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  getSummary() {
    this.getTotal();
    let date = new Date();
    date.setMinutes(date.getMinutes() + 20);
    const timeToPickUp = `Your Please pick up at \n${date.toTimeString()}`;

    let orderSummary = ["You orders are: "];
    this.items.forEach((item, index) => {
      orderSummary.push(
        `${index + 1}. ${item.description} \nPrice: ${this.formatPrice(
          item.finalPrice
        )}`
      );
    });

    orderSummary.push(
      `The estimated price of your order is ${this.formatPrice(this.total)} `
    );
    orderSummary.push(timeToPickUp);

    this.reset();
    return orderSummary;
  }

  getTotal() {
    this.items.forEach((item) => (this.total += item.finalPrice));
    return this.total;
  }
}

module.exports = new Order();
