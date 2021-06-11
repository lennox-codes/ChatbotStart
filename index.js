const express = require("express");
const app = express();
const Order = require("./classes/Order");
const Menu = require("./classes/Menu");

const ShawarmaOrder = require("./menuOrders/Shawarma");
const PizzaOrder = require("./menuOrders/Pizza");
const SteakOrder = require("./menuOrders/Steak");

// Bodyparser
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("www"));

app.get("/users/:uname", (req, res) => {
  res.end("Hello " + req.params.uname);
});

app.post("/sms", (req, res) => {
  let aReply = [];
  const sender = req.body.from;
  const message = req.body.body && req.body.body.toLowerCase();

  // Clears everything => First important step
  if (req.body.clear) {
    console.log(req.body);
    return Order.reset();
  }

  // Checks to see if there is an active order, otherwise, it creates a new one
  if (Order.custId === "") {
    console.log("have sender");
    Order.custId = sender;
  }

  // Wrap this all in a switch case so that things are easier to read, goddamnit
  switch (Order.state) {
    case "welcoming":
      console.log("Asking items to choose");
      Order.state = "selecting";
      const welcomeMessage = !Order.items.length
        ? "Welcome to Richard's Shawarma."
        : "";
      const askOrder = "What would you like to order?";
      aReply.push(welcomeMessage, askOrder, Menu.listItems());
      break;

    case "selecting":
      console.log("Selecting now");
      if (Menu.hasItem(message)) {
        Order.state = "adding";
        if (message === "shawarma") {
          Order.addItem(new ShawarmaOrder());
          takeOrder();
        } else if (message === "pizza") {
          Order.addItem(new PizzaOrder());
          takeOrder();
        } else if (message === "steak") {
          Order.addItem(new SteakOrder());
          takeOrder();
        }
      } else
        aReply.push("Please make sure that you have selected the proper item");
      break;

    case "adding":
      console.log("Adding");
      takeOrder();
      break;

    case "finished":
      console.log("finished");
      aReply = Order.getSummary();
      break;
  }

  function takeOrder() {
    const item = Order.items[Order.items.length - 1];
    aReply = item.handleInput(message);
  }

  res.setHeader("content-type", "text/xml");
  let sResponse = "<Response>";
  for (let i = 0; i < aReply.length; i++) {
    sResponse += "<Message>";
    sResponse += aReply[i];
    sResponse += "</Message>";
  }
  res.end(sResponse + "</Response>");
});

var port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () =>
  console.log("Example app listening on port " + port + "!")
);
