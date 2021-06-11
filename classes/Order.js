class Order {
  constructor() {
    this.state = "welcoming";
    this.custId = "";
    this.items = [];
    this.states = ["welcoming", "selecting", "isFinished", "moreItems"];

    if (Order._instance) {
      return Order._instance;
    }
    Order._instance = this;
  }

  reset() {
    this.state = "welcoming";
    this.items = [];
    this.custId = "";
  }

  addItem(item) {
    this.items.push(item);
  }

  getSummary() {
    let date = new Date();
    date.setMinutes(date.getMinutes() + 20);
    const timeToPickUp = `Please pick up at \n${date.toTimeString()}`;

    let itemSummary = ["You orders are: "];
    this.items.forEach((item, index) => {
      itemSummary.push(`${index + 1}. ${item.description}`);
    });

    itemSummary.push(timeToPickUp);

    this.reset();
    return itemSummary;
  }

  async advance() {
    const data = await fetch("/sms");
    //const response =
  }
}

module.exports = new Order();
